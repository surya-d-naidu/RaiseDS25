import React from 'react';

export function StatisticalBackground() {
  // VIT AP colors
  const primaryColor = "#1E3A8A"; // Dark blue
  const secondaryColor = "#C00000"; // Maroon red
  const accentColor1 = "#004D40"; // Dark teal
  const accentColor2 = "#FFB800"; // Gold
  const accentColor3 = "#4A148C"; // Purple
  const lineColor = "#94A3B8"; // Subtle gray for axes

  return (
    <div className="fixed inset-0 z-[-1] w-full h-full opacity-20 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="animate-[pulse_20s_ease-in-out_infinite]">
        {/* Grid Background Pattern */}
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={lineColor} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Bar Chart */}
        <g transform="translate(100, 100) scale(0.8)" className="animate-[pulse_8s_ease-in-out_infinite]">
          <rect x="0" y="50" width="30" height="100" fill={primaryColor} />
          <rect x="40" y="20" width="30" height="130" fill={primaryColor} />
          <rect x="80" y="70" width="30" height="80" fill={primaryColor} />
          <rect x="120" y="10" width="30" height="140" fill={primaryColor} />
          <rect x="160" y="40" width="30" height="110" fill={primaryColor} />
          <line x1="-10" y1="150" x2="200" y2="150" stroke={lineColor} strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke={lineColor} strokeWidth="2" />
        </g>

        {/* Line Chart */}
        <g transform="translate(500, 200) scale(0.8)" className="animate-[pulse_15s_ease-in-out_infinite]">
          <path d="M0,100 L50,70 L100,110 L150,30 L200,50 L250,90" 
                fill="none" stroke={accentColor1} strokeWidth="3" />
          <circle cx="0" cy="100" r="4" fill={accentColor1} />
          <circle cx="50" cy="70" r="4" fill={accentColor1} />
          <circle cx="100" cy="110" r="4" fill={accentColor1} />
          <circle cx="150" cy="30" r="4" fill={accentColor1} />
          <circle cx="200" cy="50" r="4" fill={accentColor1} />
          <circle cx="250" cy="90" r="4" fill={accentColor1} />
          <line x1="-10" y1="150" x2="280" y2="150" stroke={lineColor} strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke={lineColor} strokeWidth="2" />
        </g>

        {/* Scatter Plot */}
        <g transform="translate(150, 500) scale(0.8)" className="animate-[bounce_20s_ease-in-out_infinite]">
          <circle cx="20" cy="50" r="5" fill={secondaryColor} />
          <circle cx="50" cy="80" r="5" fill={secondaryColor} />
          <circle cx="80" cy="30" r="5" fill={secondaryColor} />
          <circle cx="110" cy="70" r="5" fill={secondaryColor} />
          <circle cx="140" cy="40" r="5" fill={secondaryColor} />
          <circle cx="170" cy="90" r="5" fill={secondaryColor} />
          <circle cx="200" cy="60" r="5" fill={secondaryColor} />
          <circle cx="40" cy="110" r="5" fill={secondaryColor} />
          <circle cx="70" cy="100" r="5" fill={secondaryColor} />
          <circle cx="130" cy="120" r="5" fill={secondaryColor} />
          <circle cx="180" cy="130" r="5" fill={secondaryColor} />
          <line x1="-10" y1="150" x2="230" y2="150" stroke={lineColor} strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke={lineColor} strokeWidth="2" />
        </g>

        {/* Bell Curve */}
        <g transform="translate(600, 600) scale(0.8)" className="animate-[pulse_12s_ease-in-out_infinite]">
          <path d="M0,150 C50,150 50,20 125,20 C200,20 200,150 250,150" 
                fill="none" stroke={accentColor3} strokeWidth="3" />
          <line x1="-10" y1="150" x2="260" y2="150" stroke={lineColor} strokeWidth="2" />
          <line x1="125" y1="160" x2="125" y2="10" stroke={lineColor} strokeDasharray="5,5" />
        </g>

        {/* Box Plot */}
        <g transform="translate(950, 350) scale(0.8)" className="animate-[pulse_10s_ease-in-out_infinite]">
          <line x1="20" y1="75" x2="200" y2="75" stroke={accentColor2} strokeWidth="2" />
          <rect x="50" y="50" width="100" height="50" stroke={accentColor2} strokeWidth="2" fill="none" />
          <line x1="100" y1="50" x2="100" y2="100" stroke={accentColor2} strokeWidth="2" />
          <line x1="20" y1="75" x2="50" y2="75" stroke={accentColor2} strokeWidth="2" />
          <line x1="150" y1="75" x2="200" y2="75" stroke={accentColor2} strokeWidth="2" />
        </g>

        {/* Pie Chart */}
        <g transform="translate(950, 100) scale(0.8)" className="animate-[spin_30s_linear_infinite]">
          <path d="M100,100 L100,20 A80,80 0 0,1 167,63 z" fill={primaryColor} />
          <path d="M100,100 L167,63 A80,80 0 0,1 180,100 z" fill={accentColor1} />
          <path d="M100,100 L180,100 A80,80 0 0,1 167,137 z" fill={accentColor2} />
          <path d="M100,100 L167,137 A80,80 0 0,1 100,180 z" fill={secondaryColor} />
          <path d="M100,100 L100,180 A80,80 0 0,1 33,137 z" fill={accentColor3} />
          <path d="M100,100 L33,137 A80,80 0 0,1 20,100 z" fill={primaryColor} opacity="0.7" />
          <path d="M100,100 L20,100 A80,80 0 0,1 33,63 z" fill={accentColor1} opacity="0.7" />
          <path d="M100,100 L33,63 A80,80 0 0,1 100,20 z" fill={accentColor2} opacity="0.7" />
        </g>

        {/* Regression Line */}
        <g transform="translate(500, 850) scale(0.8)" className="animate-[pulse_18s_ease-in-out_infinite]">
          <circle cx="30" cy="110" r="4" fill={primaryColor} />
          <circle cx="50" cy="90" r="4" fill={primaryColor} />
          <circle cx="70" cy="100" r="4" fill={primaryColor} />
          <circle cx="90" cy="75" r="4" fill={primaryColor} />
          <circle cx="110" cy="80" r="4" fill={primaryColor} />
          <circle cx="130" cy="60" r="4" fill={primaryColor} />
          <circle cx="150" cy="70" r="4" fill={primaryColor} />
          <circle cx="170" cy="50" r="4" fill={primaryColor} />
          <circle cx="190" cy="40" r="4" fill={primaryColor} />
          <line x1="20" y1="120" x2="200" y2="35" stroke={primaryColor} strokeWidth="2" strokeDasharray="5,5" />
          <line x1="-10" y1="150" x2="230" y2="150" stroke={lineColor} strokeWidth="2" />
          <line x1="0" y1="160" x2="0" y2="0" stroke={lineColor} strokeWidth="2" />
        </g>

        {/* Histogram */}
        <g transform="translate(900, 600) scale(0.8)" className="animate-[pulse_14s_ease-in-out_infinite]">
          <rect x="0" y="100" width="20" height="50" fill={secondaryColor} />
          <rect x="25" y="70" width="20" height="80" fill={secondaryColor} />
          <rect x="50" y="50" width="20" height="100" fill={secondaryColor} />
          <rect x="75" y="30" width="20" height="120" fill={secondaryColor} />
          <rect x="100" y="50" width="20" height="100" fill={secondaryColor} />
          <rect x="125" y="70" width="20" height="80" fill={secondaryColor} />
          <rect x="150" y="90" width="20" height="60" fill={secondaryColor} />
          <rect x="175" y="110" width="20" height="40" fill={secondaryColor} />
          <line x1="-10" y1="150" x2="205" y2="150" stroke={lineColor} strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export function StatisticalCursor() {
  // VIT AP primary colors
  const primaryColor = "#1E3A8A"; // Dark blue
  const secondaryColor = "#C00000"; // Maroon red

  const [position, setPosition] = React.useState({ x: -100, y: -100 });
  const [dataPoints, setDataPoints] = React.useState<{x: number, y: number}[]>([]);
  
  React.useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      
      // Update the trailing data points (for the line graph effect)
      setDataPoints(prev => {
        const newPoints = [...prev, newPosition];
        if (newPoints.length > 5) {
          return newPoints.slice(newPoints.length - 5);
        }
        return newPoints;
      });
    };
    
    window.addEventListener('mousemove', updatePosition);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);
  
  // Create path for line graph
  const getPath = () => {
    if (dataPoints.length < 2) return "";
    
    return dataPoints.map((point, index) => {
      const relativeX = point.x - position.x + 16;
      const relativeY = point.y - position.y + 16;
      return `${index === 0 ? 'M' : 'L'} ${relativeX},${relativeY}`;
    }).join(' ');
  };
  
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
        <g>
          <circle cx="16" cy="16" r="15" fill="none" stroke={primaryColor} strokeWidth="1.5" className="animate-pulse" />
          
          {/* Animated Data Points */}
          <path d={getPath()} fill="none" stroke={secondaryColor} strokeWidth="2" />
          
          {/* Dynamic Data Point */}
          <circle cx="16" cy="16" r="3" fill={secondaryColor} />
          
          {/* Coordinate Lines */}
          <line x1="16" y1="1" x2="16" y2="31" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="1" y1="16" x2="31" y2="16" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="2,2" />
        </g>
      </svg>
    </div>
  );
}