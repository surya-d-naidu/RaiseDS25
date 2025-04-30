import React from 'react';

export function StatisticalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full opacity-10 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Bar Chart */}
        <g transform="translate(100, 100) scale(0.7)">
          <rect x="0" y="50" width="30" height="100" fill="#3b82f6" />
          <rect x="40" y="20" width="30" height="130" fill="#3b82f6" />
          <rect x="80" y="70" width="30" height="80" fill="#3b82f6" />
          <rect x="120" y="10" width="30" height="140" fill="#3b82f6" />
          <rect x="160" y="40" width="30" height="110" fill="#3b82f6" />
          <line x1="-10" y1="150" x2="200" y2="150" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke="#64748b" strokeWidth="2" />
        </g>

        {/* Line Chart */}
        <g transform="translate(500, 200) scale(0.7)">
          <path d="M0,100 L50,70 L100,110 L150,30 L200,50 L250,90" 
                fill="none" stroke="#10b981" strokeWidth="3" />
          <circle cx="0" cy="100" r="4" fill="#10b981" />
          <circle cx="50" cy="70" r="4" fill="#10b981" />
          <circle cx="100" cy="110" r="4" fill="#10b981" />
          <circle cx="150" cy="30" r="4" fill="#10b981" />
          <circle cx="200" cy="50" r="4" fill="#10b981" />
          <circle cx="250" cy="90" r="4" fill="#10b981" />
          <line x1="-10" y1="150" x2="280" y2="150" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke="#64748b" strokeWidth="2" />
        </g>

        {/* Scatter Plot */}
        <g transform="translate(150, 500) scale(0.7)">
          <circle cx="20" cy="50" r="5" fill="#ef4444" />
          <circle cx="50" cy="80" r="5" fill="#ef4444" />
          <circle cx="80" cy="30" r="5" fill="#ef4444" />
          <circle cx="110" cy="70" r="5" fill="#ef4444" />
          <circle cx="140" cy="40" r="5" fill="#ef4444" />
          <circle cx="170" cy="90" r="5" fill="#ef4444" />
          <circle cx="200" cy="60" r="5" fill="#ef4444" />
          <circle cx="40" cy="110" r="5" fill="#ef4444" />
          <circle cx="70" cy="100" r="5" fill="#ef4444" />
          <circle cx="130" cy="120" r="5" fill="#ef4444" />
          <circle cx="180" cy="130" r="5" fill="#ef4444" />
          <line x1="-10" y1="150" x2="230" y2="150" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke="#64748b" strokeWidth="2" />
        </g>

        {/* Bell Curve */}
        <g transform="translate(600, 600) scale(0.7)">
          <path d="M0,150 C50,150 50,20 125,20 C200,20 200,150 250,150" 
                fill="none" stroke="#a855f7" strokeWidth="3" />
          <line x1="-10" y1="150" x2="260" y2="150" stroke="#64748b" strokeWidth="2" />
          <line x1="125" y1="160" x2="125" y2="10" stroke="#64748b" strokeDasharray="5,5" />
        </g>

        {/* Box Plot */}
        <g transform="translate(950, 350) scale(0.7)">
          <line x1="20" y1="75" x2="200" y2="75" stroke="#f59e0b" strokeWidth="2" />
          <rect x="50" y="50" width="100" height="50" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <line x1="100" y1="50" x2="100" y2="100" stroke="#f59e0b" strokeWidth="2" />
          <line x1="20" y1="75" x2="50" y2="75" stroke="#f59e0b" strokeWidth="2" />
          <line x1="150" y1="75" x2="200" y2="75" stroke="#f59e0b" strokeWidth="2" />
        </g>

        {/* Pie Chart */}
        <g transform="translate(950, 100) scale(0.7)">
          <path d="M100,100 L100,20 A80,80 0 0,1 167,63 z" fill="#4f46e5" />
          <path d="M100,100 L167,63 A80,80 0 0,1 180,100 z" fill="#059669" />
          <path d="M100,100 L180,100 A80,80 0 0,1 167,137 z" fill="#d97706" />
          <path d="M100,100 L167,137 A80,80 0 0,1 100,180 z" fill="#dc2626" />
          <path d="M100,100 L100,180 A80,80 0 0,1 33,137 z" fill="#7c3aed" />
          <path d="M100,100 L33,137 A80,80 0 0,1 20,100 z" fill="#2563eb" />
          <path d="M100,100 L20,100 A80,80 0 0,1 33,63 z" fill="#0891b2" />
          <path d="M100,100 L33,63 A80,80 0 0,1 100,20 z" fill="#65a30d" />
        </g>

        {/* Regression Line */}
        <g transform="translate(500, 850) scale(0.7)">
          <circle cx="30" cy="110" r="4" fill="#06b6d4" />
          <circle cx="50" cy="90" r="4" fill="#06b6d4" />
          <circle cx="70" cy="100" r="4" fill="#06b6d4" />
          <circle cx="90" cy="75" r="4" fill="#06b6d4" />
          <circle cx="110" cy="80" r="4" fill="#06b6d4" />
          <circle cx="130" cy="60" r="4" fill="#06b6d4" />
          <circle cx="150" cy="70" r="4" fill="#06b6d4" />
          <circle cx="170" cy="50" r="4" fill="#06b6d4" />
          <circle cx="190" cy="40" r="4" fill="#06b6d4" />
          <line x1="20" y1="120" x2="200" y2="35" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="-10" y1="150" x2="230" y2="150" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke="#64748b" strokeWidth="2" />
        </g>

        {/* Histogram */}
        <g transform="translate(900, 600) scale(0.7)">
          <rect x="0" y="100" width="20" height="50" fill="#14b8a6" />
          <rect x="25" y="70" width="20" height="80" fill="#14b8a6" />
          <rect x="50" y="50" width="20" height="100" fill="#14b8a6" />
          <rect x="75" y="30" width="20" height="120" fill="#14b8a6" />
          <rect x="100" y="50" width="20" height="100" fill="#14b8a6" />
          <rect x="125" y="70" width="20" height="80" fill="#14b8a6" />
          <rect x="150" y="90" width="20" height="60" fill="#14b8a6" />
          <rect x="175" y="110" width="20" height="40" fill="#14b8a6" />
          <line x1="-10" y1="150" x2="205" y2="150" stroke="#64748b" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export function StatisticalCursor() {
  const [position, setPosition] = React.useState({ x: -100, y: -100 });
  
  React.useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updatePosition);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);
  
  return (
    <div 
      className="fixed pointer-events-none z-50 w-8 h-8" 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g className="animate-pulse">
          <circle cx="16" cy="16" r="15" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M8,20 L12,14 L16,18 L20,10 L24,16" 
                fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}