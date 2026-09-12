import React, { useState } from 'react';
import WorkflowCanvas from './WorkflowCanvas';
import NodeConfigPanel from './NodeConfigPanel';

const App: React.FC = () => {
  // State for managing selected node and config panel visibility
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Handle clicking on a canvas node to select it and open config panel
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowConfigPanel(true);
  };

  // Handle closing the config panel
  const handleCloseConfig = () => {
    setShowConfigPanel(false);
    if (selectedNodeId) {
      setSelectedNodeId(null);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative' as const, overflow: 'hidden' as const }}>
        <WorkflowCanvas 
          onNodeClick={handleNodeClick}
          selectedNodeId={selectedNodeId}
        />
        
        {/* Config Panel - Conditional rendering */}
        {showConfigPanel && (
          <NodeConfigPanel 
            selectedNodeId={selectedNodeId || null}
            onClose={handleCloseConfig}
          />
        )}
      </div>
    </div>
  );
};

export default App;
