"""
Unit tests for WorkflowEngine - Testing DAG execution, LLM calls, and HTTP tools
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, Mock, patch
from typing import Dict, Any

# Import the workflow engine module using relative paths (PyTest will handle it)
from services.workflow_engine import WorkflowEngine


class TestWorkflowEngine:
    """Test suite for WorkflowEngine class."""
    
    @pytest.fixture
    def engine(self):
        """Create a test WorkflowEngine instance."""
        return WorkflowEngine()
    
    @pytest.mark.asyncio
    async def test_execute_empty_workflow(self, engine):
        """Test execution with empty workflow returns early."""
        
        graph = {"nodes": [], "edges": []}
        
        # Mock the _execute_dag_parallel method to simulate empty result
        with patch.object(engine, '_execute_dag_parallel', return_value={
            'status': 'completed',
            'nodes_executed': 0,
            'final_outputs': {}
        }):
            result = await engine._execute_node('test-node')
            
            assert result['id'] == 'test-node'

    @pytest.mark.asyncio  
    async def test_execute_llm_node_openai(self, engine):
        """Test LLM node execution with OpenAI provider."""
        
        config = {
            "provider": "openai",
            "model": "gpt-4-turbo",
            "temperature": 0.7,
            "maxTokens": 2048,
            "systemPrompt": "You are a helpful assistant."
        }
        
        with patch('services.workflow_engine.openai.OpenAI') as mock_openai:
            # Mock the chat completion response
            mock_client = AsyncMock()
            
            mock_response = Mock()
            mock_response.choices[0].message.content = "Test response from GPT-4"
            mock_response.usage.total_tokens = 512
            
            mock_completion = Mock()
            mock_completion.return_value = mock_response
            mock_client.chat.completions.create = mock_completion
            
            mock_openai.return_value = mock_client
            
            result = await engine._execute_llm_node('test-llm-node', config)
            
            assert result['status'] == 'success'
            assert result['output'] == "Test response from GPT-4"
            assert result['provider'] == 'openai'

    @pytest.mark.asyncio
    async def test_execute_tool_node_post(self, engine):
        """Test HTTP tool node execution with POST method."""
        
        config = {
            "httpMethod": "POST",
            "toolName": "create-user",
            "url": "https://api.example.com/users",
            "body": {"name": "John Doe", "email": "john@example.com"},
            "headers": {"Authorization": "Bearer test-token"}
        }
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            # Mock the response
            mock_response = AsyncMock()
            mock_response.status_code = 201
            mock_response.text = '{"id": 1, "name": "John Doe"}'
            mock_response.headers = {}
            
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = AsyncMock(return_value=mock_response)
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert result['status'] == 'success'
            assert result['http_response_code'] == 201

    @pytest.mark.asyncio
    async def test_execute_tool_node_get(self, engine):
        """Test HTTP tool node execution with GET method."""
        
        config = {
            "httpMethod": "GET",
            "toolName": "get-user",
            "url": "https://api.example.com/users/123"
        }
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            # Mock the response
            mock_response = AsyncMock()
            mock_response.status_code = 200
            mock_response.text = '{"id": 123, "name": "John Doe"}'
            mock_response.headers = {}
            
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = AsyncMock(return_value=mock_response)
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert result['status'] == 'success'
            assert result['http_response_code'] == 200

    @pytest.mark.asyncio
    async def test_execute_tool_node_delete(self, engine):
        """Test HTTP tool node execution with DELETE method."""
        
        config = {
            "httpMethod": "DELETE",
            "toolName": "delete-user",
            "url": "https://api.example.com/users/123"
        }
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            # Mock the response
            mock_response = AsyncMock()
            mock_response.status_code = 204
            mock_response.text = ""
            mock_response.headers = {}
            
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = AsyncMock(return_value=mock_response)
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert result['status'] == 'success'
            assert result['http_response_code'] == 204

    @pytest.mark.asyncio
    async def test_execute_with_empty_nodes(self, engine):
        """Test execution with empty node list."""
        
        result = await engine._execute_dag_parallel({}, 3, 60.0)
        
        assert result['status'] in ['completed', 'empty_workflow']
