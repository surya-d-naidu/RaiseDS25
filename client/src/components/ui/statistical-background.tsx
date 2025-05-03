import { useEffect, useRef } from 'react';

export default function StatisticalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // VIT AP primary color
    const primaryColor = '#980019';
    const secondaryColor = '#b22234';
    const accentColor = '#cc3344';
    
    // Create data points
    const points: {x: number; y: number; vx: number; vy: number; size: number}[] = [];
    const numPoints = Math.min(Math.floor(canvas.width * canvas.height / 8000), 200);
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
    
    // Create connection lines
    const connectionDistance = 120;
    
    // Distribution curve data
    const curvePoints: {x: number; y: number}[] = [];
    const normalDistribution = (x: number, mean: number, stdDev: number) => {
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    };
    
    const updateCurvePoints = () => {
      curvePoints.length = 0;
      const curveWidth = canvas.width * 0.8;
      const curveHeight = canvas.height * 0.4;
      const xStart = canvas.width * 0.1;
      const yBase = canvas.height * 0.6;
      
      for (let i = 0; i <= 100; i++) {
        const x = xStart + (i / 100) * curveWidth;
        const xNorm = i / 100;
        
        // Normal distribution curve
        const height = normalDistribution(xNorm, 0.5, 0.15) * curveHeight * 5;
        
        curvePoints.push({
          x: x,
          y: yBase - height
        });
      }
    };
    
    updateCurvePoints();
    
    // Bar chart data
    const bars: {x: number; height: number; width: number; value: number}[] = [];
    
    const updateBars = () => {
      bars.length = 0;
      const numBars = 8;
      const barWidth = canvas.width * 0.05;
      const maxHeight = canvas.height * 0.4;
      const gap = canvas.width * 0.02;
      const totalWidth = (barWidth + gap) * numBars - gap;
      const startX = (canvas.width - totalWidth) / 2;
      
      const values = Array.from({length: numBars}, () => Math.random() * 0.9 + 0.1);
      
      for (let i = 0; i < numBars; i++) {
        const value = values[i];
        bars.push({
          x: startX + i * (barWidth + gap),
          height: value * maxHeight,
          width: barWidth,
          value: value
        });
      }
    };
    
    updateBars();
    
    // Animate function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#14171f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw data points
      points.forEach(point => {
        // Update position
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = accentColor + '90'; // With opacity
        ctx.fill();
      });
      
      // Draw connections between close points
      ctx.strokeStyle = accentColor + '30'; // With opacity
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.globalAlpha = opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
      
      // Draw distribution curve
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      
      for (let i = 1; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      
      ctx.stroke();
      
      // Draw area under curve
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, canvas.height * 0.6);
      
      for (let i = 0; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      
      ctx.lineTo(curvePoints[curvePoints.length - 1].x, canvas.height * 0.6);
      ctx.closePath();
      ctx.fillStyle = primaryColor + '20'; // With opacity
      ctx.fill();
      
      // Draw bar chart
      bars.forEach(bar => {
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(
          bar.x, 
          canvas.height * 0.9 - bar.height, 
          bar.x, 
          canvas.height * 0.9
        );
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          bar.x, 
          canvas.height * 0.9 - bar.height, 
          bar.width, 
          bar.height
        );
        
        // Add value on top of bar
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(10, canvas.width * 0.01)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
          Math.round(bar.value * 100).toString(), 
          bar.x + bar.width / 2, 
          canvas.height * 0.9 - bar.height - 5
        );
      });
      
      // Draw grid lines
      ctx.strokeStyle = '#ffffff20'; // White with opacity
      ctx.lineWidth = 0.5;
      
      // Horizontal grid lines
      for (let i = 1; i < 8; i++) {
        const y = i * (canvas.height / 8);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let i = 1; i < 12; i++) {
        const x = i * (canvas.width / 12);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Animate scattered points
      points.forEach(point => {
        // Add slight randomness to velocity for more natural movement
        point.vx += (Math.random() - 0.5) * 0.02;
        point.vy += (Math.random() - 0.5) * 0.02;
        
        // Limit velocity
        const maxVel = 0.6;
        const vel = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        if (vel > maxVel) {
          point.vx = (point.vx / vel) * maxVel;
          point.vy = (point.vy / vel) * maxVel;
        }
      });
      
      // Request next frame
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}