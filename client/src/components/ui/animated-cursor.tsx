import { useEffect, useState, useRef } from 'react';

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [dataPoints, setDataPoints] = useState<Array<{ x: number; y: number; time: number }>>([]);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Disable any existing cursor styles that might conflict
    const disableExistingCursors = () => {
      const existingCursors = document.querySelectorAll('.cursor-dot, .cursor-outline, .cursor-trail');
      existingCursors.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
    };
    
    disableExistingCursors();
    
    // Short-lived trail (only keep points for a short time)
    const maxDataPoints = 10; // Fewer points for a shorter trail
    const trailLifetime = 500; // Trail disappears after 500ms
    
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
      if (Math.random() > 0.3) {
        addDataPoint(e.clientX, e.clientY);
      }
    };

    // Clean up old trail points
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setDataPoints(prev => 
        prev.filter(point => now - point.time < trailLifetime)
      );
    }, 100);

    const handleMouseEnter = () => setLinkHovered(true);
    const handleMouseLeave = () => setLinkHovered(false);
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const mouseOutsideWindow = () => setPosition({ x: -100, y: -100 });

    // Add all event listeners
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', mouseOutsideWindow);
    
    // Add hover events to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Clean up function
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', mouseOutsideWindow);
      clearInterval(cleanupInterval);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Create connecting lines between data points for graph effect
  const renderGraphLines = () => {
    if (dataPoints.length < 2) return null;
    
    return dataPoints.slice(0, -1).map((point, index) => {
      const nextPoint = dataPoints[index + 1];
      
      // Calculate line length and angle
      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      // Calculate opacity based on recency
      const now = Date.now();
      const age = now - point.time;
      const maxAge = 500; // Match the trailLifetime
      const opacity = Math.max(0, 1 - age / maxAge);
      
      return (
        <div
          key={`line-${index}`}
          style={{
            position: 'fixed',
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: `${length}px`,
            height: '1px', // Thin line
            background: `rgba(0, 0, 0, ${opacity})`, // Black lines with fading opacity
            pointerEvents: 'none',
            zIndex: 99997,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
          }}
        />
      );
    });
  };

  return (
    <>
      {/* Pink circle with graph-like crosshair */}
      <div
        className="cursor-crosshair"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: 'fixed',
          width: linkHovered ? '24px' : '20px', // Smaller size
          height: linkHovered ? '24px' : '20px', // Smaller size
          background: 'transparent',
          border: `1px solid rgba(255, 105, 180, ${clicked ? '1' : '0.8'})`, // Pink border
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border 0.2s',
        }}
      >
        {/* Crosshair vertical line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1px', // Thin
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)', // Black line
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Crosshair horizontal line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '1px', // Thin
            background: 'rgba(0, 0, 0, 0.8)', // Black line
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Small center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: clicked ? '4px' : '3px', // Small dot
            height: clicked ? '4px' : '3px', // Small dot
            background: 'rgba(255, 105, 180, 0.9)', // Pink dot
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      
      {/* Graph connecting lines */}
      {renderGraphLines()}
      
      {/* Trailing points visualization (quickly disappearing) */}
      {dataPoints.map((point, index) => {
        // Calculate opacity based on age
        const now = Date.now();
        const age = now - point.time;
        const maxAge = 500; // Match the trailLifetime
        const opacity = Math.max(0, 1 - age / maxAge);
        
        return (
          <div
            key={`point-${index}`}
            style={{
              position: 'fixed',
              left: `${point.x}px`,
              top: `${point.y}px`,
              width: '3px',
              height: '3px',
              background: `rgba(255, 105, 180, ${opacity})`, // Pink with fading opacity
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 99998,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
      
      {/* Add global animation styles */}
      <style>{`
        /* Hide default cursor */
        body {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}