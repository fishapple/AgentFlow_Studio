import React from 'react';

interface ConnectionLineProps {
  sourceNode: string;
  targetNode: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ sourceNode, targetNode }) => {
  // Mock coordinates - in production would calculate dynamically based on node positions
  const startX = 100 + Math.random() * 50;
  const startY = 200 + Math.random() * 100;
  const endX = 400 + Math.random() * 50;
  const endY = 200 + Math.random() * 100;

  return (
    <svg 
      style={{
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Bezier curve path */}
      <path
        d={`M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`}
        fill="none"
        stroke="#9ca3af"
        strokeWidth={2}
        strokeLinecap='round'
      />
      
      {/* Data flow arrow */}
      <circle cx={startX} cy={startY} r={4} fill="#6b7280" />
    </svg>
  );
};

export default ConnectionLine;
