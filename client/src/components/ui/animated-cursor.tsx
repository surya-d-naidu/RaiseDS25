import { useEffect, useState } from 'react';

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; opacity: number }>>([]);

  useEffect(() => {
    const addTrailPoint = (x: number, y: number) => {
      // Add new point
      const newPoint = { x, y, opacity: 1 };
      
      // Update all trails
      setTrails(prevTrails => {
        const updatedTrails = prevTrails.map(point => ({
          ...point,
          opacity: point.opacity - 0.1 // Decrease opacity
        })).filter(point => point.opacity > 0); // Remove fully transparent
        
        return [...updatedTrails, newPoint].slice(-10); // Keep only last 10 points
      });
    };

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Only add trail point every few movements to avoid too many points
      if (Math.random() > 0.7) {
        addTrailPoint(e.clientX, e.clientY);
      }
    };

    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]')
        .forEach(el => {
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

  const cursorDotClasses = `cursor-dot ${clicked ? 'scale-50' : ''} ${linkHovered ? 'scale-150' : ''}`;
  const cursorOutlineClasses = `cursor-outline ${clicked ? 'scale-75' : ''} ${linkHovered ? 'scale-125' : ''}`;

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
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      
      {/* Cursor trails */}
      {trails.map((trail, index) => (
        <div 
          key={index}
          className="cursor-trail"
          style={{ 
            left: `${trail.x}px`, 
            top: `${trail.y}px`,
            opacity: trail.opacity,
            transform: `translate(-50%, -50%) scale(${trail.opacity})`
          }}
        />
      ))}
    </>
  );
}