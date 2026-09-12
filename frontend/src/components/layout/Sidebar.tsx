import React from 'react';

interface SidebarProps {
  currentView: 'editor' | 'library' | 'settings';
  onViewChange: (view: 'editor' | 'library' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'editor', label: 'Workflow Editor', icon: 'workflow-icon' },
    { id: 'library', label: 'Node Library', icon: 'library-icon' },
    { id: 'settings', label: 'Settings', icon: 'settings-icon' },
  ];

  return (
    <aside style={{ 
      width: '256px',
      padding: '20px 12px',
      backgroundColor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      position: 'fixed',
      top: '56px',
      left: 0,
      bottom: 0,
    }}>
      <h3 style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#6b7280', 
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>Menu</h3>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as typeof currentView)}
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: currentView === item.id ? '#3b82f6' : 'transparent',
              color: currentView === item.id ? 'white' : '#4b5563',
              fontWeight: currentView === item.id ? '500' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon === 'workflow-icon' && <WorkflowIcon />}
            {item.icon === 'library-icon' && <LibraryIcon />}
            {item.icon === 'settings-icon' && <SettingsIcon />}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Recent Workflows */}
      <div style={{ marginTop: '24px', marginBottom: '16px' }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>Recent Workflows</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {['Customer Support Bot', 'Data Analysis Pipeline', 'Weather Forecast App'].map((name, index) => (
            <button 
              key={index}
              className="recent-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#4b5563',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <div 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: index === 0 ? '#22c55e' : index === 1 ? '#f59e0b' : '#6b7280'
                }} 
              />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Quick Stats</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <StatItem label="Total Workflows" value="24" />
          <StatItem label="Active Runs" value="3" />
          <StatItem label="Success Rate" value="98%" />
        </div>
      </div>
    </aside>
  );
};

const WorkflowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e40af' }}>{value}</span>
    <span style={{ fontSize: '11px', color: '#6b7280' }}>{label}</span>
  </div>
);

export default Sidebar;
