import { useState } from 'react';
import Header from '@components/layout/Header';
import Sidebar from '@components/layout/Sidebar';
import WorkflowCanvas from '@components/canvas/WorkflowCanvas';

function App() {
  const [currentView, setCurrentView] = useState<'editor' | 'library' | 'settings'>('editor');

  return (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <Header onViewChange={setCurrentView} />
      
      {/* 主内容区 */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        {/* 左侧边栏 */}
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
        />
        
        {/* 中间画布区域 */}
        <main style={{ flex: 1, padding: '20px' }}>
          {currentView === 'editor' && (
            <WorkflowCanvas />
          )}
          
          {currentView === 'library' && (
            <div className="empty-state">
              <h2>节点库</h2>
              <p>即将上线...</p>
            </div>
          )}
          
          {currentView === 'settings' && (
            <div className="empty-state">
              <h2>设置</h2>
              <p>配置管理功能开发中...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
