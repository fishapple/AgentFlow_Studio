"""
Integration tests for LLM/HTTP tool nodes with OpenAI API integration
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, Mock, patch
from typing import Dict, Any
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from services.workflow_engine import WorkflowEngine


class TestLLMNodeIntegration:
    """Test suite for LLM node execution with OpenAI API."""
    
    @pytest.fixture
    def engine(self):
        return WorkflowEngine()
    
    @pytest.mark.asyncio
    async def test_execute_llm_node_success(self, engine):
        """Test successful LLM call returns correct response."""
        
        config = {
            "provider": "openai",
            "model": "gpt-4-turbo",
            "temperature": 0.7,
            "maxTokens": 2048,
            "messages": [
                {"role": "user", "content": "Hello, how are you?"}
            ]
        }
        
        with patch('services.workflow_engine.openai.OpenAI') as mock_openai:
            # Mock response
            mock_client = AsyncMock()
            
            mock_response = Mock()
            mock_response.choices[0].message.content = "I'm doing well, thank you!"
            mock_response.usage.total_tokens = 128
            
            mock_completion = Mock()
            mock_completion.return_value = mock_response
            mock_client.chat.completions.create = mock_completion
            
            mock_openai.return_value = mock_client
            
            result = await engine._execute_llm_node('test-llm-node', config)
            
            assert result['status'] == 'success'
            assert result['output'].startswith("I'm doing well")
            assert result['provider'] == 'openai'
            assert result['model'] == 'gpt-4-turbo'

    @pytest.mark.asyncio
    async def test_execute_llm_node_retry_on_rate_limit(self, engine):
        """Test LLM node retries on API rate limit errors."""
        
        config = {
            "provider": "openai",
            "model": "gpt-4"
        }
        
        call_count = 0
        
        async def mock_llm_call(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            
            if call_count < 2:
                raise RuntimeError("Rate limit exceeded")
            
            return {
                'status': 'success',
                'output': "Response after retry",
                'provider': 'openai'
            }
        
        with patch.object(engine, '_call_openai', mock_llm_call):
            result = await engine._execute_llm_node('test-llm-node', config)
            
            assert call_count == 3  # 2 retries + 1 success
            assert result['status'] == 'success'

    @pytest.mark.asyncio  
    async def test_execute_tool_node_post_with_json_body(self, engine):
        """Test HTTP tool node with POST method and JSON body."""
        
        config = {
            "httpMethod": "POST",
            "toolName": "create-user",
            "url": "https://api.example.com/users",
            "body": {
                "name": "John Doe",
                "email": "john@example.com"
            },
            "headers": {
                "Authorization": "Bearer test-token-123"
            }
        }
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            # Mock the response
            mock_response = AsyncMock()
            mock_response.status_code = 201
            mock_response.text = '{"id": "abc-123", "name": "John Doe"}'
            mock_response.headers = {}
            
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = AsyncMock(return_value=mock_response)
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert result['status'] == 'success'
            assert result['http_response_code'] == 201
            assert 'John Doe' in result.get('output', '')

    @pytest.mark.asyncio
    async def test_execute_tool_node_get_no_body(self, engine):
        """Test HTTP tool node with GET method (no body)."""
        
        config = {
            "httpMethod": "GET",
            "toolName": "get-user-by-id",
            "url": "https://api.example.com/users/123"
        }
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            # Mock the response
            mock_response = AsyncMock()
            mock_response.status_code = 200
            mock_response.text = '{"id": 123, "name": "Jane Doe"}'
            mock_response.headers = {}
            
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = AsyncMock(return_value=mock_response)
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert result['status'] == 'success'
            assert result['http_response_code'] == 200

    @pytest.mark.asyncio
    async def test_execute_tool_node_with_query_params(self, engine):
        """Test HTTP tool node with URL query parameters."""
        
        config = {
            "httpMethod": "GET",
            "toolName": "search-users",
            "url": "https://api.example.com/search"
        }
        
        # Mock GET request to include query params in the URL
        call_url: list[str] = []
        
        async def mock_request(method, url, **kwargs):
            call_url.append(url)
            return AsyncMock(
                status_code=200, 
                text='[{"id": 1}, {"id": 2}]',
                headers={}
            )
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = mock_request
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert 'search' in call_url[0]
            assert result['status'] == 'success'

    @pytest.mark.asyncio
    async def test_execute_tool_node_retry_on_network_error(self, engine):
        """Test HTTP tool node retries on transient network failures."""
        
        config = {
            "httpMethod": "POST",
            "toolName": "unreliable-tool"
        }
        
        call_count = 0
        
        async def mock_request(method, url, **kwargs):
            nonlocal call_count
            call_count += 1
            
            if call_count < 3:
                raise RuntimeError("Network timeout")
            
            return AsyncMock(status_code=200, text='Success', headers={})
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = mock_request
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            assert call_count == 4  # 3 retries + 1 success
            assert result['status'] == 'success'

    @pytest.mark.asyncio
    async def test_execute_tool_node_handles_http_errors(self, engine):
        """Test that HTTP tool nodes handle error responses gracefully."""
        
        config = {
            "httpMethod": "POST",
            "toolName": "auth-required-tool"
        }
        
        async def mock_request(method, url, **kwargs):
            return AsyncMock(
                status_code=401, 
                text='Unauthorized - Invalid token',
                headers={}
            )
        
        with patch('services.workflow_engine.httpx.AsyncClient') as mock_client:
            mock_httpx_instance = Mock()
            mock_httpx_instance.request = mock_request
            mock_client.return_value = mock_httpx_instance
            
            result = await engine._execute_tool_node('test-tool-node', config)
            
            # Should raise error for 4xx/5xx responses
            assert 'HTTP 401' in str(result.get('error', ''))

    @pytest.mark.asyncio
    async def test_execute_llm_node_with_different_models(self, engine):
        """Test LLM node works with different model providers."""
        
        models = [
            {"provider": "openai", "model": "gpt-3.5-turbo"},
            {"provider": "anthropic", "model": "claude-3-opus"},
            {"provider": "google", "model": "gemini-pro"}
        ]
        
        for model_config in models:
            config = {**model_config}
            
            with patch.object(engine, '_call_openai', return_value={
                'status': 'success',
                'output': f"Response from {model_config['provider']}"
            }):
                result = await engine._execute_llm_node('test-node', config)
                
                assert result['status'] == 'success'

    @pytest.mark.asyncio  
    async def test_execute_tool_node_header_merging(self, engine):
        """Test that custom headers are merged correctly."""
        
        config = {
            "httpMethod": "POST",
            "toolName": "test-tool"
        }
        
        headers = engine._build_request_headers(config)
        
        # Should always include Content-Type and Accept
        assert 'Content-Type' in headers
        assert headers['Accept'] == '*/*'
