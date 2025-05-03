import { useEffect, useState, useRef } from 'react';

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [dataPoints, setDataPoints] = useState<Array<{ x: number; y: number; time: number }>>([]);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const maxDataPoints = 20; // Keep 20 points for the graph
    
    const addDataPoint = (x: number, y: number) => {
      // Only add points when there's enough movement
      const distance = Math.sqrt(
        Math.pow(x - lastPositionRef.current.x, 2) + 
        Math.pow(y - lastPositionRef.current.y, 2)
      );
      
      if (distance < 5) return; // Skip small movements
      
      lastPositionRef.current = { x, y };
      
      // Add new data point with timestamp
      const newPoint = { x, y, time: Date.now() };
      
      // Update data points, keeping only the latest ones
      setDataPoints(prev => [...prev, newPoint].slice(-maxDataPoints));
    };

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add data point with controlled frequency
      if (Math.random() > 0.4) {
        addDataPoint(e.clientX, e.clientY);
      }
    };

    const handleLinkHoverEvents = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]'
      );
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', () => setClicked(true));
    document.addEventListener('mouseup', () => setClicked(false));
    handleLinkHoverEvents();
    
    const mouseOutsideWindow = () => setPosition({ x: -100, y: -100 });
    document.documentElement.addEventListener('mouseleave', mouseOutsideWindow);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', () => setClicked(true));
      document.removeEventListener('mouseup', () => setClicked(false));
      document.documentElement.removeEventListener('mouseleave', mouseOutsideWindow);
      
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]')
        .forEach(el => {
          el.removeEventListener('mouseenter', () => setLinkHovered(true));
          el.removeEventListener('mouseleave', () => setLinkHovered(false));
        });
    };
  }, []);

  // Create SVG path from data points
  const createPath = () => {
    if (dataPoints.length < 2) return '';
    
    // Create a path string from the data points
    let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
    
    for (let i = 1; i < dataPoints.length; i++) {
      path += ` L ${dataPoints[i].x} ${dataPoints[i].y}`;
    }
    
    return path;
  };

  const cursorDotClasses = `cursor-dot ${clicked ? 'scale-50' : ''} ${linkHovered ? 'scale-150' : ''}`;
  const cursorOutlineClasses = `cursor-outline ${clicked ? 'scale-75' : ''} ${linkHovered ? 'scale-150' : ''}`;

  return (
    <>
      {/* Main cursor dot */}
      <div 
        className={cursorDotClasses} 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      
      {/* Cursor outline */}
      <div 
        className={cursorOutlineClasses} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
        }}
      />
      
      {/* Statistical graph trail */}
      {dataPoints.length > 1 && (
        <svg 
          className="cursor-graph"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9990,
          }}
        >
          <path
            d={createPath()}
            fill="none"
            stroke="hsla(var(--primary), 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5,5"
            style={{
              transition: 'stroke 0.3s',
            }}
          />
          
          {/* Data point markers */}
          {dataPoints.map((point, index) => {
            const age = Date.now() - point.time;
            const opacity = Math.max(0, 1 - age / 1000);
            
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={3}
                fill="hsla(var(--primary), 0.7)"
                style={{
                  opacity: opacity,
                  transition: 'opacity 0.5s',
                }}
              />
            );
          })}
        </svg>
      )}
    </>
  );
}