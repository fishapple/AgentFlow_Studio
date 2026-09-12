import React from 'react';

interface NodeProps {
  id: string;
  type: 'llm' | 'tool' | 'condition' | 'parallel' | 'human';
  data?: any;
}

// Suppress unused variable warning - this is a placeholder for future integration
const _unusedNodeProps: (props: NodeProps) => void = (_props) => {
  return null;
};

const nodeColors = {
  llm: '#dbeafe', // blue-100
  tool: '#fef3c7', // amber-100
  condition: '#dcfce7', // green-100
  parallel: '#fae8ff', // fuchsia-100
  human: '#fecaca', // red-100,
};

const nodeIcons = {
  llm: '⚡️ LLM Call',
  tool: '🔧 Tool Call',
  condition: '📋 Condition',
  parallel: '⚛️ Parallel',
  human: '👤 Human Input',
};

const Node: React.FC<{ type: 'llm' | 'tool' | 'condition' | 'parallel' | 'human'; }> = ({ type }) => {
  return (
    <div 
      className="workflow-node"
      style={{
        position: 'absolute' as const,
        left: '50%',
        top: '50%',
        width: 200,
        backgroundColor: nodeColors[type],
        borderLeft: `4px solid ${getBorderColor(type)}`,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'grab',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Node Header */}
      <div 
        className="node-header"
        style={{
          padding: '8px 12px',
          fontWeight: '600',
          fontSize: '13px',
          color: '#4b5563',
          cursor: 'grab',
        }}
      >
        {nodeIcons[type]}
      </div>

      {/* Node Config Area (hidden by default, shows on hover) */}
      <div 
        className="node-config"
        style={{
          padding: '8px 12px',
          fontSize: '12px',
          color: '#6b7280',
          borderTop: '1px solid #f3f4f6',
          maxHeight: 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {type === 'llm' && (
          <div>
            <p><strong>Model:</strong> GPT-4</p>
            <p><strong>Temperature:</strong> 0.7</p>
            <p><strong>Max Tokens:</strong> 2048</p>
          </div>
        )}
        {type === 'tool' && (
          <div>
            <p><strong>Name:</strong> Weather API</p>
            <p><strong>Type:</strong> HTTP Request</p>
          </div>
        )}
        {type === 'condition' && (
          <div>
            <p><strong>Condition:</strong> If temperature &gt; 30°C</p>
            <p><strong>Else:</strong> Else branch</p>
          </div>
        )}
      </div>

      {/* Node Footer with controls */}
      <div 
        className="node-footer"
        style={{
          padding: '4px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <button 
          className="node-action-btn"
          style={{
            padding: '2px 8px',
            fontSize: '10px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            color: '#6b7280',
            cursor: 'pointer' as const,
          }}
        >
          ✏️ Config
        </button>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {/* Input connection port */}
          <div 
            className="connection-port"
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#9ca3af',
              border: '2px solid #ffffff',
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.1)',
            }}
          />
          
          {/* Output connection port */}
          <div 
            className="connection-port"
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#9ca3af',
              border: '2px solid #ffffff',
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const getBorderColor = (type: string): string => {
  const colors = {
    llm: '#3b82f6', // blue-500
    tool: '#d97706', // amber-600
    condition: '#16a34a', // green-600
    parallel: '#c026d3',  // fuchsia-600
    human: '#dc2626',   // red-600,
  };
  return colors[type as keyof typeof colors];
};

export default Node;
