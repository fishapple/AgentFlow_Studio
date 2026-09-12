import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onViewChange: (view: 'editor' | 'library' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange }) => {
  const navigate = useNavigate();
  
  return (
    <header className="header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }}>
      {/* Logo and Title */}
      <div 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="8" width="16" height="16" rx="3" fill="#3b82f6"/>
          <path d="M10 12h4v8H10z" fill="white"/>
        </svg>
        <span style={{ 
          marginLeft: '12px', 
          fontWeight: '700', 
          fontSize: '18px',
          color: '#1f2937'
        }}>AgentFlow Studio</span>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => onViewChange('editor')}
          className={`nav-btn ${window.location.pathname === '/' ? 'active' : ''}`}
          style={getNavButtonStyle('editor')}
        >
          Workflow Editor
        </button>
        <button 
          onClick={() => onViewChange('library')}
          className="nav-btn"
          style={getNavButtonStyle('library')}
        >
          Node Library
        </button>
        <button 
          onClick={() => onViewChange('settings')}
          className="nav-btn"
          style={getNavButtonStyle('settings')}
        >
          Settings
        </button>
      </nav>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="https://github.com/fishapple/AgentFlow_Studio" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.59.11.78-.26.78-.58v-1.9c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.77-1.34-1.77-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.75.4-1.3.7-1.6-2.56-.3-5.2-1.28-5.2-5.7 0-1.26.46-2.3 1.18-3.09-.12-.3-.53-1.51.12-3.13 0 0 .98-.31 3.22 1.17a10.65 10.65 0 015.48 0c2.23-1.48 3.22-1.17 3.22-1.17 .66 1.62.25 2.83.13 3.13 .72.79 1.18 1.83 1.18 3.09 0 4.42-2.65 5.36-5.2 5.66.49.42.9.98.9 1.97v2.88c0 .32.19.69.78.58C21.57 21.8 25 17.31 25 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </header>
  );
};

const getNavButtonStyle = (view: string) => ({
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: view === 'editor' ? '#eff6ff' : 'transparent',
  color: view === 'editor' ? '#3b82f6' : '#6b7280',
  fontWeight: view === 'editor' ? '500' : '400',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

export default Header;
