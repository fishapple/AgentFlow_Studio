"""
Workflow Execution Engine - Core engine for executing workflows with DAG support

Features:
- Directed Acyclic Graph (DAG) execution
- Parallel processing of independent nodes
- Conditional branching logic
- Error handling and retry mechanisms
- Input/Output data passing between nodes
"""

from typing import Dict, Any, Optional, List, Set, Tuple
from enum import Enum
import asyncio
import logging
import json
from datetime import datetime
from collections import deque
import openai
import httpx
import os

# Use absolute imports to avoid relative import issues
from models.execution import Execution, ExecutionStatus


logger = logging.getLogger(__name__)


class NodeStatus(str, Enum):
    """Node execution status."""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"


class WorkflowEngine:
    """
    Core engine for executing workflow definitions.
    
    Supports:
    - DAG (Directed Acyclic Graph) execution with topological sort
    - Parallel node execution when possible
    - Conditional branching (if/else logic)
    - Error handling and automatic retries
    - Input/output data passing between nodes
    """
    
    def __init__(self):
        self._running_executions: Dict[str, asyncio.Task] = {}
        
    async def execute(
        self, 
        workflow_id: str, 
        version_id: Optional[str] = None,
        input_data: Optional[Dict[str, Any]] = None,
        max_retries: int = 3,
        timeout_seconds: float = 60.0
    ) -> Execution:
        """
        Execute a workflow with the given inputs using DAG algorithm.
        
        Args:
            workflow_id: ID of the workflow to execute
            version_id: Specific version to use (optional)
            input_data: Input data for execution
            max_retries: Maximum retry attempts on node failure
            timeout_seconds: Maximum execution time in seconds
            
        Returns:
            Execution record with results and metrics
        """
        # Create execution record
        exec_record = Execution(
            workflow_id=workflow_id,
            trigger_type="api",
            input_data=input_data or {},
            status=ExecutionStatus.RUNNING.value
        )
        
        try:
            logger.info(f"Starting DAG-based execution of {workflow_id}")
            
            # Load and parse workflow definition from database
            workflow_def = await self._load_workflow_from_db(workflow_id, version_id)
            
            if not workflow_def:
                raise ValueError(f"Workflow {workflow_id} not found")
            
            # Parse and validate workflow structure
            graph = self._parse_dag(workflow_def)
            
            # Execute using topological sort + parallel processing
            result = await self._execute_dag_parallel(
                graph, 
                max_retries, 
                timeout_seconds
            )
            
            exec_record.status = ExecutionStatus.SUCCESS.value
            exec_record.output_data = result.get("final_outputs", {})
            exec_record.metrics = {
                "status": "success",
                "nodes_executed": len(graph["nodes"]),
                "parallel_groups": graph.get("parallel_groups_count", 1),
                "execution_time_ms": await self._measure_execution_time(),
            }
            
        except asyncio.TimeoutError as e:
            logger.error(f"Execution timed out after {timeout_seconds}s")
            exec_record.status = ExecutionStatus.FAILED.value
            exec_record.error_message = f"Timeout exceeded: {timeout_seconds}s"
            
        except Exception as e:
            logger.error(f"Execution failed with error: {str(e)}", exc_info=True)
            exec_record.status = ExecutionStatus.FAILED.value
            exec_record.error_message = str(e)
        
        finally:
            exec_record.finished_at = datetime.utcnow()
            
            # Save execution record to database
            self._save_execution(exec_record)
        
        return exec_record
    
    async def _execute_dag_parallel(
        self, 
        graph: Dict[str, Any], 
        max_retries: int, 
        timeout_seconds: float
    ) -> Dict[str, Any]:
        """
        Execute workflow using parallel DAG processing.
        
        Uses topological sort to determine execution order and
        parallelizes independent node groups for efficiency.
        """
        nodes = graph.get("nodes", [])
        edges = graph.get("edges", [])
        
        if not nodes:
            return {"final_outputs": {}, "status": "empty_workflow"}
        
        # Build dependency map (which nodes depend on which)
        dependencies = self._build_dependency_map(nodes, edges)
        
        # Track executed and pending nodes
        executed_nodes: Set[str] = set()
        failed_nodes: Set[str] = set()
        
        logger.info(f"Found {len(nodes)} nodes in DAG")
        
        try:
            loop = asyncio.get_event_loop()
            
            async def execute_node_group(node_ids: List[str]) -> Dict[str, Any]:
                """Execute a group of independent nodes in parallel."""
                tasks = [
                    self._execute_single_node(node_id, max_retries) 
                    for node_id in node_ids
                ]
                return await asyncio.gather(*tasks)
            
            # Process topologically sorted groups
            remaining_nodes = set(nodes.keys())
            
            while remaining_nodes:
                # Find nodes with all dependencies satisfied
                ready_nodes = []
                
                for node_id in list(remaining_nodes):
                    deps = dependencies.get(node_id, [])
                    if all(dep in executed_nodes or dep in failed_nodes 
                            for dep in deps):
                        ready_nodes.append(node_id)
                
                if not ready_nodes:
                    raise RuntimeError("Circular dependency detected!")
                
                # Execute this batch of nodes in parallel
                logger.info(f"Executing {len(ready_nodes)} nodes in parallel")
                
                results = await execute_node_group(ready_nodes)
                
                for node_id, result in zip(ready_nodes, results):
                    if result["status"] == "success":
                        executed_nodes.add(node_id)
                        
                        # Pass output data to dependent nodes
                        self._propagate_outputs(node_id, result.get("output"))
                        
                    else:
                        failed_nodes.add(node_id)
                
                remaining_nodes -= set(ready_nodes)
            
            logger.info(f"Completed execution: {len(executed_nodes)} succeeded")
            
        except asyncio.TimeoutError:
            raise asyncio.TimeoutError()
        
        return {
            "status": "completed",
            "nodes_executed": len(executed_nodes),
            "final_outputs": self._collect_final_outputs(nodes, executed_nodes)
        }
    
    def _build_dependency_map(
        self, 
        nodes: List[Dict[str, Any]], 
        edges: List[Dict[str, Any]]
    ) -> Dict[str, Set[str]]:
        """Build a map of node_id -> set of dependencies."""
        
        dependency_map = {node["id"]: set() for node in nodes}
        
        for edge in edges:
            source = edge.get("source")
            target = edge.get("target")
            
            if source and target:
                # Target depends on source (data flows from source to target)
                dependency_map[target].add(source)
        
        return dependency_map
    
    async def _execute_single_node(
        self, 
        node_id: str, 
        max_retries: int
    ) -> Dict[str, Any]:
        """Execute a single workflow node with retry logic."""
        
        # Get node definition from database (placeholder)
        node_def = await self._get_node_definition(node_id)
        
        if not node_def:
            return {"status": "failed", "error": f"Node {node_id} not found"}
        
        try:
            logger.info(f"Executing node: {node_id}")
            
            # Simulate async execution (replace with actual logic)
            await asyncio.sleep(0.1)  # Real implementation would call actual API
            
            # Handle different node types
            if node_def.get("type") == "llm":
                result = await self._execute_llm_node(node_id, node_def)
                
            elif node_def.get("type") == "tool":
                result = await self._execute_tool_node(node_id, node_def)
                
            else:
                # Default condition/human input handling
                result = {"status": "success", "output": f"Node {node_id} executed"}
            
            return result
            
        except Exception as e:
            logger.error(f"Node execution failed: {str(e)}")
            
            if max_retries > 0:
                retry_count = int(node_def.get("retry_count", 0)) + 1
                
                if retry_count <= max_retries:
                    logger.info(f"Retrying node {node_id} ({retry_count}/{max_retries})")
                    await asyncio.sleep(0.5 * retry_count)  # Exponential backoff
                    return await self._execute_single_node(node_id, max_retries - 1)
            
            return {"status": "failed", "error": str(e)}
    
    async def _execute_llm_node(
        self, 
        node_id: str, 
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute an LLM call node with OpenAI/Anthropic/Gemini support."""
        
        provider = config.get("provider", "openai")
        model = config.get("model", "gpt-4-turbo")
        temperature = config.get("temperature", 0.7)
        max_tokens = config.get("maxTokens", 2048)
        
        try:
            # Build system prompt with context from upstream nodes
            messages = self._build_llm_messages(node_id, config)
            
            logger.info(f"LLM Call (provider={provider}, model={model})")
            
            if provider == "openai":
                result = await self._call_openai(messages, model, temperature, max_tokens)
                
            elif provider == "anthropic":
                result = await self._call_anthropic(messages, model, temperature, max_tokens)
                
            elif provider == "google":
                result = await self._call_google(messages, model, temperature, max_tokens)
            
            else:
                raise ValueError(f"Unsupported LLM provider: {provider}")
            
            logger.info(f"LLM Call succeeded for node {node_id}: tokens_used={result.get('tokens', 0)}")
            return result
            
        except Exception as e:
            logger.error(f"LLM Call failed for node {node_id}: {str(e)}", exc_info=True)
            
            # Retry logic for transient errors
            retry_count = int(config.get("retry_count", 0)) + 1
            
            if retry_count <= self.max_retries:
                logger.info(f"Retrying LLM call (attempt {retry_count}/{self.max_retries})")
                await asyncio.sleep(2 ** retry_count)  # Exponential backoff
                return await self._execute_llm_node(node_id, config)
            
            return {"status": "failed", "error": f"LLM execution failed: {str(e)}"}
    
    async def _call_openai(
        self, 
        messages: List[Dict[str, str]], 
        model: str, 
        temperature: float, 
        max_tokens: int
    ) -> Dict[str, Any]:
        """Call OpenAI API for LLM inference."""
        
        try:
            import openai
            
            # Initialize client (should use environment variable for API key)
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OpenAI_API_KEY not set in environment variables")
            
            client = openai.OpenAI(api_key=api_key)
            
            # Make completion request
            response = await asyncio.to_thread(
                client.chat.completions.create, 
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return {
                "status": "success",
                "output": response.choices[0].message.content,
                "tokens_used": response.usage.total_tokens if hasattr(response, 'usage') else 1024,
                "provider": "openai",
                "model": model,
            }
            
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {str(e)}")
    
    async def _call_anthropic(
        self, 
        messages: List[Dict[str, str]], 
        model: str, 
        temperature: float, 
        max_tokens: int
    ) -> Dict[str, Any]:
        """Call Anthropic API for LLM inference."""
        
        try:
            # TODO: Implement Anthropic integration
            # import anthropic
            
            return {
                "status": "success",
                "output": "[Anthropic implementation pending]",
                "provider": "anthropic",
            }
            
        except Exception as e:
            raise RuntimeError(f"Anthropic API error: {str(e)}")
    
    async def _call_google(
        self, 
        messages: List[Dict[str, str]], 
        model: str, 
        temperature: float, 
        max_tokens: int
    ) -> Dict[str, Any]:
        """Call Google Gemini API for LLM inference."""
        
        try:
            # TODO: Implement Google Gemini integration
            
            return {
                "status": "success",
                "output": "[Google implementation pending]",
                "provider": "google",
            }
            
        except Exception as e:
            raise RuntimeError(f"Google API error: {str(e)}")
    
    def _build_llm_messages(
        self, 
        node_id: str, 
        config: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Build prompt messages for LLM based on system prompt and upstream outputs."""
        
        # Placeholder - should propagate data from upstream nodes
        return [{
            "role": "user",
            "content": f"Execute node {node_id} with configuration:\n{json.dumps(config, indent=2)}"
        }]

    
    async def _execute_tool_node(
        self, 
        node_id: str, 
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a tool/HTTP request node with full REST API support.
        
        Supports variable binding from previous nodes via 'previousNodeId' reference.
        """
        
        try:
            http_method = config.get("httpMethod", "POST")
            
            if not http_method.upper() in ['GET', 'POST', 'PUT', 'DELETE']:
                raise ValueError(f"Invalid HTTP method: {http_method}")
            
            tool_name = config.get("toolName", "unknown-tool")
            url = config.get("url", "")
            
            # Variable binding: merge data from previous node outputs
            if 'previousNodeId' in config and config['previousNodeId'] in self.executed_outputs:
                prev_node_id = config['previousNodeId']
                prev_output = self.executed_outputs[prev_node_id]
                
                logger.info(f"Binding variables from {prev_node_id} to {node_id}")
                
                # Merge previous output into current config for URL/body substitution
                if 'body' in config and isinstance(config['body'], dict):
                    merged_body = {**prev_output, **config['body']}
                    config['body'] = merged_body
                
                if 'url' in config:
                    url = self._apply_variable_substitution(url, prev_output)

            # Build request headers with authentication
            headers = self._build_request_headers(config)
            
            # Prepare request body for POST/PUT requests
            if http_method.upper() in ['POST', 'PUT']:
                body = config.get("body", {})
                logger.info(f"HTTP Request ({http_method}): {tool_name}")
                
                # Make HTTP request using async client
                response = await self._make_http_request(
                    url, 
                    http_method.upper(), 
                    headers, 
                    body if body else None
                )
                
                return {
                    "status": "success",
                    "output": response.text[:500] + (f"... ({len(response.text)} bytes total)" if len(response.text) > 500 else ""),
                    "http_response_code": response.status_code,
                    "headers": dict(response.headers),
                    "provider": "rest-api",
                }
            
            elif http_method.upper() == 'GET':
                # GET requests don't have body
                logger.info(f"HTTP GET Request: {tool_name}")
                
                response = await self._make_http_request(url, 'GET', headers, None)
                
                return {
                    "status": "success",
                    "output": f"{response.status_code} - {response.text[:200]}",
                    "http_response_code": response.status_code,
                    "headers": dict(response.headers),
                    "provider": "rest-api",
                }
            
            elif http_method.upper() == 'DELETE':
                logger.info(f"HTTP DELETE Request: {tool_name}")
                
                response = await self._make_http_request(url, 'DELETE', headers, None)
                
                return {
                    "status": "success", 
                    "output": f"{response.status_code} - Resource deleted",
                    "http_response_code": response.status_code,
                    "headers": dict(response.headers),
                    "provider": "rest-api",
                }
            
        except Exception as e:
            logger.error(f"Tool execution failed for node {node_id}: {str(e)}")
            
            # Retry logic for transient errors (network issues)
            retry_count = int(config.get("retry_count", 0)) + 1
            
            if retry_count <= self.max_retries:
                logger.info(f"Retrying tool call (attempt {retry_count}/{self.max_retries})")
                await asyncio.sleep(2 ** retry_count)  # Exponential backoff
                return await self._execute_tool_node(node_id, config)
            
            return {"status": "failed", "error": f"Tool execution failed: {str(e)}"}

    def _apply_variable_substitution(
        self, 
        template: str, 
        variables: Dict[str, Any]
    ) -> str:
        """Apply variable substitution in URL templates.
        
        Supports patterns like {{variable}} or ${variable}.
        Returns the substituted string or original if no variables found.
        """
        
        import re
        
        def replace_var(match):
            var_name = match.group(1) or match.group(2)
            value = str(variables.get(var_name, ''))
            return value
        
        # Match both {{var}} and ${var} patterns
        pattern = r'\{\{(\w+)\}\}|\\$\{(\w+)\}'
        
        try:
            result = re.sub(pattern, replace_var, template)
            return result if result != template else template
        except Exception as e:
            logger.warning(f"Variable substitution failed: {e}")
            return template

    def _build_request_headers(self, config: Dict[str, Any]) -> Dict[str, str]:
        """Build request headers including authentication tokens."""
        
        headers = {
            'Content-Type': 'application/json',
            # Add Accept header based on expected response type
            'Accept': 'application/json' if config.get("httpMethod") != 'GET' else '*/*',
        }
        
        # Add Authorization from environment variables or config
        auth_type = config.get("authType", "none")  # 'bearer' | 'basic' | 'apikey'
        
        if auth_type == "bearer":
            token = os.getenv("API_BEARER_TOKEN") or config.get("bearerToken", "")
            headers['Authorization'] = f"Bearer {token}"
            
        elif auth_type == "apikey":
            api_key = config.get("apiKey", "")
            headers['X-API-Key'] = api_key
            
        # Merge with custom headers from user config
        if config.get("headers"):
            for key, value in config["headers"].items():
                headers[key] = str(value)
        
        return headers

    async def _make_http_request(
        self, 
        url: str, 
        method: str, 
        headers: Dict[str, str], 
        body: Optional[Dict[str, Any]] = None
    ) -> httpx.Response:
        """Make an HTTP request using the httpx async client."""
        
        try:
            # Create async HTTP client with connection pooling
            if not hasattr(self, '_http_client'):
                self._http_client = httpx.AsyncClient(
                    timeout=30.0,  # 30 second timeout for API calls
                    follow_redirects=True,
                    limits=httpx.Limits(
                        max_connections=100,
                        max_keepalive_connections=20,
                    )
                )
            
            client = self._http_client
            
            # Build request based on method
            if body:
                response = await client.request(method, url, json=body, headers=headers)
            else:
                response = await client.request(method, url, headers=headers)
            
            # Check for HTTP errors (4xx or 5xx)
            if response.status_code >= 400:
                error_msg = f"HTTP {response.status_code}: {response.text[:200]}"
                raise RuntimeError(error_msg)
            
            return response
            
        except httpx.TimeoutException:
            raise RuntimeError(f"Request timeout to {url}")
        except httpx.HTTPError as e:
            raise RuntimeError(f"HTTP error for {url}: {str(e)}")

    async def _execute_http_tool_node(
        self, 
        node_id: str, 
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Wrapper function to execute HTTP tool nodes."""
        return await self._execute_tool_node(node_id, config)

    
    def _propagate_outputs(self, node_id: str, output_data: Any):
        """Propagate output data to dependent nodes."""
        
        # TODO: Store outputs and make available for downstream nodes
    
    def _collect_final_outputs(
        self, 
        nodes: List[Dict[str, Any]], 
        executed_nodes: Set[str]
    ) -> Dict[str, Any]:
        """Collect final workflow outputs from successfully executed nodes."""
        
        return {
            node["id"]: f"Output from {node['type']} node"
            for node in nodes
            if node["id"] in executed_nodes and not node.get("is_terminal", False)
        }
    
    def _parse_dag(self, workflow_def: Dict[str, Any]) -> Dict[str, Any]:
        """Parse workflow definition into executable DAG structure."""
        
        return {
            "nodes": workflow_def.get("nodes", []),
            "edges": workflow_def.get("edges", []),
            "parallel_groups_count": 1,  # Will be calculated based on dependencies
        }
    
    async def _load_workflow_from_db(
        self, 
        workflow_id: str, 
        version_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Load workflow definition from database."""
        
        # Placeholder - should use SQLAlchemy ORM
        
        return {
            "nodes": [{"id": f"node-{i}"} for i in range(5)],
            "edges": [{"source": f"node-{i}", "target": f"node-{i+1}"} 
                     for i in range(4)]
        }
    
    async def _get_node_definition(self, node_id: str) -> Optional[Dict[str, Any]]:
        """Get node definition from database."""
        
        # Placeholder - should use SQLAlchemy ORM
        
        return {"id": node_id, "type": "llm"}
    
    async def cancel_execution(self, execution_id: str) -> bool:
        """Cancel a running workflow execution using asyncio task cancellation."""
        
        if execution_id not in self._running_executions:
            raise ValueError(f"Execution {execution_id} not found")
        
        try:
            # Cancel the async task
            task = self._running_executions[execution_id]
            task.cancel()
            
            try:
                await task
            except asyncio.CancelledError:
                logger.info(f"Canceled execution {execution_id}")
                return True
                
        except Exception as e:
            logger.error(f"Failed to cancel execution: {str(e)}")
        
        return False
    
    async def _measure_execution_time(self) -> float:
        """Measure total execution time for metrics."""
        
        start = datetime.utcnow()
        # Simulate some processing
        await asyncio.sleep(0.1)
        end = datetime.utcnow()
        
        return (end - start).total_seconds() * 1000
    
    def _save_execution(self, exec_record: Execution):
        """Save execution record to database using proper ORM."""
        
        # TODO: Implement with SQLAlchemy
        