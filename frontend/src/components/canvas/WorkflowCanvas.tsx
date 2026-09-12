import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';

const WorkflowCanvas: React.FC<{
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}> = ({ onNodeClick, _selectedNodeId }) => {
  const [nodes, setNodes] = useNodesState([
    // LLM Call Node
    {
      id: 'llm-1',
      type: 'llm',
      data: { config: { provider: 'openai', model: 'gpt-4' } },
      position: { x: 200, y: 250 },
    },
    // Tool Call Node (Weather API)
    {
      id: 'tool-1',
      type: 'tool',
      data: { config: { toolName: 'weather-api' } },
      position: { x: 500, y: 200 },
    },
    // Condition Node (Temperature check)
    {
      id: 'condition-1',
      type: 'condition',
      data: { config: { conditionType: 'if' } },
      position: { x: 500, y: 300 },
    },
    // Tool Call Node (Send Email)
    {
      id: 'tool-2',
      type: 'tool',
      data: { config: { toolName: 'send-email' } },
      position: { x: 800, y: 150 },
    },
    // Tool Call Node (Log Message)
    {
      id: 'tool-3',
      type: 'tool',
      data: { config: { toolName: 'log-message' } },
      position: { x: 800, y: 350 },
    },
  ]);

  const [edges, setEdges] = useEdgesState([
    { id: 'llm-to-tool-1', source: 'llm-1', target: 'tool-1' },
    { id: 'llm-to-condition-1', source: 'llm-1', target: 'condition-1' },
    { id: 'tool-to-email', source: 'tool-1', target: 'tool-2' },
    { id: 'condition-to-log', source: 'condition-1', target: 'tool-3' },
  ]);

  // Add a new node to canvas on right-click (context menu click)
  const onInit = useCallback((reactFlowInstance: any) => {
    console.log('React Flow initialized!', reactFlowInstance);
    
    // Calculate positions for new nodes based on existing ones
    if (!nodes.length) {
      return;
    }

    // Right-click context menu would trigger node addition here
  }, [nodes]);

  // Handle connecting nodes with edges (when dragging from source handle to target)
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('🔗 New connection:', params);
      
      setEdges((eds: any) => addEdge({
        ...params,
        type: 'bezier', // Smooth bezier curve for better UX
        animated: true,     // Show animation when connecting
        style: { stroke: '#6b7280', strokeWidth: 2 },
      }, eds));
    },
    []
  );

  return (
    <div className="canvas-wrapper" style={{
      width: '100%',
      height: 'calc(100vh - 56px)',
      position: 'relative',
      background: '#fafafa',
      overflow: 'hidden' as const,
    }}>
      {/* Canvas Toolbar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 24,
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        background: 'rgba(255,255,255,0.9)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '500', marginRight: '12px', color: '#6b7280' }}>
          🎨 Workflow Editor
        </div>
        
        {/* Undo Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Implement undo functionality using react-flow history
          disabled={true}
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          title="Undo (Ctrl+Z)"
        >
          ↩️ Undo
        </button>

        {/* Redo Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Implement redo functionality using react-flow history
          disabled={true}
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          title="Redo (Ctrl+Y)"
        >
          ↪️ Redo
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 8px' }} />

        {/* Save Button */}
        <button className="canvas-btn" onClick={() => {}}>
          💾 Save Workflow
        </button>

        {/* Clear Canvas Button */}
        <button 
          className="canvas-btn" 
          onClick={() => {}} // TODO: Implement clear canvas functionality
          style={{ color: '#dc2626' }}
          title="Clear all nodes and edges"
        >
          🗑️ Clear All
        </button>

        {/* Zoom Controls Info */}
        <div style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>
          {Math.round((ReactFlow as any).defaultZoom || 1 * 100)}% Zoom
        </div>

        {/* Connection Mode Toggle */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Enable/disable connection mode
          style={{ marginLeft: 'auto' }}
          title="Toggle connection mode (drag from handle)"
        >
          🔗 Connect Nodes
        </button>

        {/* Add Node Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Implement node addition functionality
          title="Add new workflow node"
        >
          ➕ Add Node
        </button>
      </div>

      {/* Properties Panel (Right Sidebar) */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 24,
        width: 280,
        height: 'calc(100% - 40px)',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e5e7eb',
        boxShadow: '-4px 0 8px rgba(0,0,0,0.05)',
        borderRadius: '8px',
        overflow: 'hidden' as const,
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Properties</h3>
        </div>
        
        {nodes.length === 0 ? (
          <div style={{ 
            padding: '24px', 
            textAlign: 'center' as const, 
            color: '#9ca3af',
            background: '#f9fafb',
          }}>
            No nodes selected<br/>
            Click to add a node or start building your workflow
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {nodes.map((node) => (
              <div 
                key={node.id}
                style={{
                  marginBottom: 16,
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getNodeBorderColor(node.type)}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: getNodeColor(node.type),
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    {getNodeLabel(node.type)}
                  </span>
                  <button 
                    className="canvas-btn"
                    onClick={() => setNodes((nds) => nds.map((n) => (n.id === node.id ? {...n, selected: true} : n)))}
                  >
                    Select
                  </button>
                </div>
                
                {/* Node Configuration */}
                <div style={{ marginTop: 12 }}>
                  {node.type === 'llm' && (
                    <>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>
                        Provider
                      </label>
                      <select className="canvas-btn" defaultValue="openai">
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="google">Google</option>
                      </select>
                      
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginTop: 12, marginBottom: 4 }}>
                        Model
                      </label>
                      <input 
                        type="text" 
                        defaultValue="gpt-4"
                        className="canvas-btn"
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </>
                  )}

                  {node.type === 'tool' && (
                    <>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>
                        Tool Name
                      </label>
                      <input 
                        type="text" 
                        defaultValue={node.data?.config?.toolName || ''}
                        className="canvas-btn"
                        style={{ width: '100%', padding: '6px' }}
                      />
                      
                      <select className="canvas-btn" defaultValue="POST" style={{ marginTop: 12 }}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </>
                  )}

                  {node.type === 'condition' && (
                    <>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>
                        Condition Type
                      </label>
                      <select className="canvas-btn" defaultValue="if">
                        <option value="if">IF (branch)</option>
                        <option value="unless">UNLESS</option>
                        <option value="switch">SWITCH</option>
                      </select>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 12 }}>
                  <button className="canvas-btn" style={{ flex: 1, background: '#dbeafe' }} onClick={() => {}}>
                    ✏️ Edit Config
                  </button>
                  <button 
                    className="canvas-btn" 
                    onClick={() => setNodes((nds) => nds.filter(n => n.id !== node.id))} 
                    title="Delete Node (Press Delete key)"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Add Nodes Panel */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #f3f4f6',
          background: '#eff6ff',
        }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: 8 }}>
            Quick Add Nodes (Right-click to add)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button 
              className="canvas-btn"
              onClick={() => {}} // TODO: Implement node addition
              style={{ fontSize: '11px', padding: '6px', background: '#fff', border: 'none' }}
            >
              ➕ LLM Call Node
            </button>
            <button 
              className="canvas-btn"
              onClick={() => {}} // TODO: Implement node addition
              style={{ fontSize: '11px', padding: '6px', background: '#fff', border: 'none' }}
            >
              🔧 Tool Call Node
            </button>
          </div>
        </div>

        {/* Connection Instructions */}
        <div style={{ 
          padding: '12px', 
          borderTop: '1px solid #f3f4f6',
          background: '#fef3c7',
          fontSize: '11px',
          color: '#92400e'
        }}>
          <strong>💡 Tip:</strong> Drag from output port (right) to input port (left) to connect nodes.
        </div>
      </div>

      {/* Main Canvas Area - React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        
        onConnect={onConnect}
        onInit={onInit}
        
        // Canvas configuration
        fitView
        
        zoomOnScroll={true}
        zoomOnPinch={true}
        
        onDoubleClick={() => {}} // Right-click context menu placeholder
        
        attributionPosition='bottom-left'
      >
        {/* Background Grid */}
        <Background 
          id="background" 
          color="#e5e7eb" 
          gap={24}
          className="custom-background"
        />

        {/* Controls (Zoom, Fit) */}
        <Controls showInteractive={true} style={{ position: 'absolute', right: 20, bottom: 20 }} />

        {/* Mini Map - Shows entire canvas even when zoomed out */}
        <MiniMap 
          nodeColor={(node) => getNodeColor(node.type)}
          zoomable={true}
          pannable={true}
          style={{ position: 'absolute', right: 20, bottom: 60 }}
        />

        {/* Connection Helper - Shows when dragging from source */}
        {nodes.some(n => n.selected) && (
          <div 
            className="connection-helper"
            style={{
              position: 'absolute' as const,
              top: '-24px',
              left: 0,
              width: '100%',
              textAlign: 'center' as const,
              fontSize: '13px',
              fontWeight: '500',
              color: '#dc2626',
              pointerEvents: 'none' as const,
            }}
          >
            🎯 Click on a target node to connect!
          </div>
        )}
      </ReactFlow>

      {/* Right-click context menu (placeholder) */}
      <div 
        className="context-menu"
        onClick={() => {}} // TODO: Implement custom context menu with Add Node options
        style={{
          position: 'absolute' as const,
          top: 150,
          left: 150,
          background: '#fff',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 10000,
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '500' }}>Add Node</div>
        
        {/* LLM Call Node Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Add LLM node at current position
          style={{ display: 'block', width: '100%', padding: '6px 8px', background: '#eff6ff', border: 'none', cursor: 'pointer' }}
        >
          ⚡️ LLM Call Node
        </button>

        {/* Tool Call Node Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Add Tool node at current position
          style={{ display: 'block', width: '100%', padding: '6px 8px', background: '#fef3c7', border: 'none', cursor: 'pointer' }}
        >
          🔧 Tool Call Node
        </button>

        {/* Condition Node Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Add Condition node at current position
          style={{ display: 'block', width: '100%', padding: '6px 8px', background: '#dcfce7', border: 'none', cursor: 'pointer' }}
        >
          📋 Condition Node
        </button>

        {/* Parallel Node Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Add Parallel node at current position
          style={{ display: 'block', width: '100%', padding: '6px 8px', background: '#fae8ff', border: 'none', cursor: 'pointer' }}
        >
          ⚛️ Parallel Node
        </button>

        {/* Human Input Node Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Add Human Input node at current position
          style={{ display: 'block', width: '100%', padding: '6px 8px', background: '#fecaca', border: 'none', cursor: 'pointer' }}
        >
          👤 Human Input Node
        </button>

        {/* Separator */}
        <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />

        {/* Delete Button */}
        <button 
          className="canvas-btn"
          onClick={() => {}} // TODO: Delete selected node(s)
          style={{ display: 'block', width: '100%', padding: '6px 8px', background: '#fee2e2', border: 'none', cursor: 'pointer' }}
        >
          🗑️ Delete Selected
        </button>
      </div>
    </div>
  );
};

// Helper function to get node colors based on type
const getNodeColor = (type: string): string => {
  const colors = {
    llm: '#3b82f6', // blue-500
    tool: '#d97706', // amber-600
    condition: '#16a34a', // green-600
    parallel: '#c026d3',  // fuchsia-600
    human: '#dc2626',   // red-600,
  };
  return (colors[type] as string) || '#6b7280';
};

const getNodeBorderColor = (type: string): string => {
  const colors = {
    llm: '#3b82f6', // blue-500
    tool: '#d97706', // amber-600  
    condition: '#16a34a', // green-600
    parallel: '#c026d3',  // fuchsia-600
    human: '#dc2626',   // red-600,
  };
  return (colors[type] as string) || '#6b7280';
};

const getNodeLabel = (type: string): string => {
  const labels = {
    llm: 'LLM Call',
    tool: 'Tool Call',
    condition: 'Condition',
    parallel: 'Parallel',
    human: 'Human Input',
  };
  return labels[type] || type;
};

export default WorkflowCanvas;
