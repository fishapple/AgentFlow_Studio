import React, { useState } from 'react';

interface NodeConfigPanelProps {
  selectedNodeId: string | null;
  onClose: () => void;
}

// Type definitions for different node configurations
export interface LLMNodeConfig {
  provider?: 'openai' | 'anthropic' | 'google';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ToolNodeConfig {
  toolName?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

export interface ConditionNodeConfig {
  conditionType: 'if' | 'unless' | 'switch';
  variableName?: string;
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=';
  value?: unknown;
}

// Union type for all node configurations
export type NodeConfig = LLMNodeConfig | ToolNodeConfig | ConditionNodeConfig;

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ selectedNodeId, onClose }) => {
  // Use any type to allow flexible configuration structure
  const [config, setConfig] = useState<any>({
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    httpMethod: 'POST',
    conditionType: 'if',
  });

  if (!selectedNodeId) {
    return (
      <div style={{ 
        padding: '16px', 
        background: '#f9fafb', 
        borderRadius: '8px',
        textAlign: 'center' as const,
        color: '#9ca3af',
      }}>
        No node selected<br/>
        Click a node to edit its configuration
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '16px',
      borderTop: '1px solid #f3f4f6',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: 12 }}>
        Node Configuration
      </h3>

      {/* LLM Call Config */}
      {selectedNodeId.startsWith('llm-') && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {/* Provider Selection */}
          <div>
            <label 
              htmlFor="provider" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              LLM Provider
            </label>
            <select 
              id="provider"
              className="canvas-input"
              value={config.provider || 'openai'}
              onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="google">Google (Gemini)</option>
            </select>
          </div>

          {/* Model Selection */}
          <div>
            <label 
              htmlFor="model" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Model Version
            </label>
            <input 
              id="model"
              type="text"
              className="canvas-input"
              value={config.model || 'gpt-4'}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              placeholder="gpt-4-turbo"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* Temperature Slider */}
          <div>
            <label 
              htmlFor="temperature" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Temperature: {config.temperature}
            </label>
            <input 
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature || 0.7}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ 
              fontSize: '11px', 
              color: '#9ca3af', 
              marginTop: 4,
              display: 'flex',
              gap: '16px'
            }}>
              <span>0.0 (Precise)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label 
              htmlFor="maxTokens" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Max Tokens: {config.maxTokens || 2048}
            </label>
            <input 
              id="maxTokens"
              type="number"
              className="canvas-input"
              value={config.maxTokens || 2048}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
              min="1"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* System Prompt */}
          <div>
            <label 
              htmlFor="systemPrompt" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              System Prompt
            </label>
            <textarea 
              id="systemPrompt"
              className="canvas-input"
              value={config.systemPrompt || ''}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              placeholder="You are a helpful assistant..."
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
            <button 
              className="canvas-btn"
              onClick={() => {}} // TODO: Save configuration to backend
              style={{ flex: 1, background: '#dbeafe', border: 'none', padding: '8px' }}
            >
              💾 Save Configuration
            </button>
            <button 
              className="canvas-btn"
              onClick={() => {}} // TODO: Test node execution locally
              style={{ flex: 1, background: '#fef3c7', border: 'none', padding: '8px' }}
            >
              ▶️ Test Node
            </button>
          </div>
        </div>
      )}

      {/* Tool/HTTP Call Config */}
      {selectedNodeId.startsWith('tool-') && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {/* Tool Name */}
          <div>
            <label 
              htmlFor="toolName" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Tool/HTTP Name
            </label>
            <input 
              id="toolName"
              type="text"
              className="canvas-input"
              value={config.toolName || ''}
              onChange={(e) => setConfig({ ...config, toolName: e.target.value })}
              placeholder="weather-api"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* HTTP Method */}
          <div>
            <label 
              htmlFor="httpMethod" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              HTTP Method
            </label>
            <select 
              id="httpMethod"
              className="canvas-input"
              value={config.httpMethod || 'POST'}
              onChange={(e) => setConfig({ ...config, httpMethod: e.target.value as any })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* URL Input */}
          <div>
            <label 
              htmlFor="url" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              URL (for custom tools)
            </label>
            <input 
              id="url"
              type="text"
              className="canvas-input"
              value={config.url || ''}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="https://api.example.com/data"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* Headers */}
          <div>
            <label className="canvas-label" style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>
              Headers (JSON)
            </label>
            <textarea 
              className="canvas-input"
              value={JSON.stringify(config.headers || {}, null, 2)}
              onChange={(e) => setConfig({ ...config, headers: JSON.parse(e.target.value) })}
              placeholder='{"Authorization": "Bearer xxx"}'
              rows={4}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
            <button 
              className="canvas-btn"
              onClick={() => {}} // TODO: Save configuration to backend
              style={{ flex: 1, background: '#dbeafe', border: 'none', padding: '8px' }}
            >
              💾 Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Condition/Decision Config */}
      {selectedNodeId.startsWith('condition-') && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {/* Condition Type */}
          <div>
            <label 
              htmlFor="conditionType" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Condition Type
            </label>
            <select 
              id="conditionType"
              className="canvas-input"
              value={config.conditionType || 'if'}
              onChange={(e) => setConfig({ ...config, conditionType: e.target.value as any })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="if">IF (branch if true)</option>
              <option value="unless">UNLESS (branch if false)</option>
              <option value="switch">SWITCH</option>
            </select>
          </div>

          {/* Variable Name */}
          <div>
            <label 
              htmlFor="variableName" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Variable Name
            </label>
            <input 
              id="variableName"
              type="text"
              className="canvas-input"
              value={config.variableName || ''}
              onChange={(e) => setConfig({ ...config, variableName: e.target.value })}
              placeholder="temperature"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* Operator */}
          <div>
            <label 
              htmlFor="operator" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Comparison Operator
            </label>
            <select 
              id="operator"
              className="canvas-input"
              value={config.operator || '='}
              onChange={(e) => setConfig({ ...config, operator: e.target.value as any })}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="=">=</option>
              <option value="!">!=</option>
              <option value="&">&gt;</option>
              <option value="&lt;">&lt;</option>
              <option value="&gt;=">&gt;=</option>
              <option value="&lt;=">&lt;=</option>
            </select>
          </div>

          {/* Comparison Value */}
          <div>
            <label 
              htmlFor="compareValue" 
              className="canvas-label"
              style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}
            >
              Comparison Value
            </label>
            <input 
              id="compareValue"
              type="text"
              className="canvas-input"
              value={config.value || ''}
              onChange={(e) => setConfig({ ...config, value: e.target.value })}
              placeholder="30"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
            <button 
              className="canvas-btn"
              onClick={() => {}} // TODO: Save configuration to backend
              style={{ flex: 1, background: '#dbeafe', border: 'none', padding: '8px' }}
            >
              💾 Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button 
        className="canvas-btn"
        onClick={onClose}
        style={{ width: '100%', marginTop: 8 }}
      >
        ✕ Close
      </button>
    </div>
  );
};

export default NodeConfigPanel;
