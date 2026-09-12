import React, { useRef, useState } from 'react';

interface NodeData {
  id: string;
  type: 'llm' | 'tool' | 'condition' | 'parallel' | 'human';
  x: number;
  y: number;
  config?: any;
}

const WorkflowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Sample workflow nodes for demonstration
  const [nodes] = useState<NodeData[]>([
    { 
      id: 'node-1', 
      type: 'llm', 
      x: 50, 
      y: 200,
      config: { provider: 'openai', model: 'gpt-4' }
    },
    { 
      id: 'node-2', 
      type: 'tool', 
      x: 350, 
      y: 150,
      config: { toolName: 'weather-api' }
    },
    { 
      id: 'node-3', 
      type: 'condition', 
      x: 600, 
      y: 200,
      config: { conditionType: 'if' }
    },
    { 
      id: 'node-4', 
      type: 'tool', 
      x: 850, 
      y: 150,
      config: { toolName: 'send-email' }
    },
    { 
      id: 'node-5', 
      type: 'tool', 
      x: 600, 
      y: 250,
      config: { toolName: 'log-message' }
    },
  ]);

  const [connections] = useState<{ sourceNode: string; targetNode: string }[]>([
    { sourceNode: 'node-1', targetNode: 'node-2' },
    { sourceNode: 'node-1', targetNode: 'node-3' },
    { sourceNode: 'node-2', targetNode: 'node-4' },
    { sourceNode: 'node-3', targetNode: 'node-5' },
  ]);

  return (
    <div className="canvas-wrapper" style={{ 
      width: '100%',
      height: 'calc(100vh - 56px)',
      position: 'relative',
      background: '#fafafa',
    }}>
      {/* Canvas Toolbar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 24,
        zIndex: 100,
        display: 'flex',
        gap: '8px',
      }}>
        <button className="canvas-btn" onClick={() => window.print()}>
          🖨️ Print View
        </button>
        <button className="canvas-btn">
          💾 Save Workflow
        </button>
        <div style={{ 
          width: '1px', 
          height: '32px', 
          backgroundColor: '#d1d5db',
          margin: '0 4px' 
        }} />
        <button className="canvas-btn">
          🔄 Undo (Ctrl+Z)
        </button>
        <button className="canvas-btn">
          ↩️ Redo (Ctrl+Y)
        </button>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          cursor: 'grab',
        }}
      >
        {/* Grid Background */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Center Label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center' as const,
          color: '#9ca3af',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '24px', marginBottom: 8 }}>🎨</div>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Drag and Drop Nodes to Build Your Workflow</p>
          <p style={{ fontSize: '12px', marginTop: 8 }}>Add LLM, Tools, Conditions & More</p>
        </div>

        {/* Placeholder for when nodes are added */}
        {nodes.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center' as const,
            color: '#9ca3af',
          }}>
            <p style={{ fontSize: '14px' }}>{nodes.length} nodes on canvas</p>
          </div>
        )}
      </div>

      {/* Properties Panel (placeholder) */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 24,
        width: 300,
        height: calc('100vh - 56px'),
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e5e7eb',
        boxShadow: '-4px 0 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Properties</h3>
        </div>
        
        {nodes.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center' as const, color: '#9ca3af' }}>
            Select a node to edit its properties
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: 8 }}>
              Node Properties
            </h4>
            
            {/* Mock properties */}
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              marginBottom: 8,
            }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>
                Node Name
              </label>
              <input 
                type="text" 
                defaultValue="OpenAI LLM Call"
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              marginBottom: 8,
            }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>
                Description (Optional)
              </label>
              <textarea 
                defaultValue="Connect to OpenAI GPT-4 model for text generation"
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  resize: 'vertical' as const,
                }}
              />
            </div>

            <button className="canvas-btn" style={{ width: '100%' }}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCanvas;
