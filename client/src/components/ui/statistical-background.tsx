import { useEffect, useRef } from 'react';

export default function StatisticalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size with higher resolution for better rendering
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Use devicePixelRatio for better resolution on high-DPI screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.scale(dpr, dpr);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // VIT AP primary color scheme
    const primaryColor = '#980019';
    const secondaryColor = '#b22234';
    const accentColor = '#cc3344';
    const backgroundColor = '#14171f';
    
    // Create data points
    const points: {x: number; y: number; vx: number; vy: number; size: number; color: string}[] = [];
    const numPoints = Math.min(Math.floor(canvas.width * canvas.height / 6000), 250);
    
    // Colors with different opacities for particles
    const particleColors = [
      `${primaryColor}90`,
      `${secondaryColor}90`,
      `${accentColor}90`,
      '#ffffff50'
    ];
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    }
    
    // Create connection lines
    const connectionDistance = 150;
    
    // Distribution curve data
    const curvePoints: {x: number; y: number}[] = [];
    // Multiple curves for animation
    let curvePhase = 0;
    
    const normalDistribution = (x: number, mean: number, stdDev: number) => {
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    };
    
    const updateCurvePoints = (phase: number) => {
      curvePoints.length = 0;
      const curveWidth = canvas.width * 0.8;
      const curveHeight = canvas.height * 0.4;
      const xStart = canvas.width * 0.1;
      const yBase = canvas.height * 0.6;
      
      // Dynamic mean that moves with the animation phase
      const dynamicMean = 0.5 + Math.sin(phase) * 0.15;
      // Dynamic standard deviation
      const dynamicStdDev = 0.15 + Math.cos(phase * 0.5) * 0.05;
      
      for (let i = 0; i <= 100; i++) {
        const x = xStart + (i / 100) * curveWidth;
        const xNorm = i / 100;
        
        // Normal distribution curve with dynamic parameters
        const height = normalDistribution(xNorm, dynamicMean, dynamicStdDev) * curveHeight * 5;
        
        curvePoints.push({
          x: x,
          y: yBase - height
        });
      }
    };
    
    // Initial curve points
    updateCurvePoints(0);
    
    // Bar chart data with animation
    const bars: {x: number; height: number; targetHeight: number; width: number; value: number}[] = [];
    let lastBarUpdateTime = 0;
    
    const updateBars = () => {
      const numBars = 8;
      const barWidth = canvas.width * 0.05;
      const maxHeight = canvas.height * 0.4;
      const gap = canvas.width * 0.02;
      const totalWidth = (barWidth + gap) * numBars - gap;
      const startX = (canvas.width - totalWidth) / 2;
      
      // Generate new values for bars
      const values = Array.from({length: numBars}, () => Math.random() * 0.9 + 0.1);
      
      // Update target heights for animation
      if (bars.length === 0) {
        // First initialization
        for (let i = 0; i < numBars; i++) {
          const value = values[i];
          bars.push({
            x: startX + i * (barWidth + gap),
            height: 0, // Start from 0 for initial animation
            targetHeight: value * maxHeight,
            width: barWidth,
            value: value
          });
        }
      } else {
        // Update existing bars with new targets
        for (let i = 0; i < numBars; i++) {
          const value = values[i];
          bars[i].targetHeight = value * maxHeight;
          bars[i].value = value;
        }
      }
      
      lastBarUpdateTime = Date.now();
    };
    
    // Initialize bars
    updateBars();
    
    // Animation timing
    let lastFrameTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;
    
    // Animation variables
    let animationTime = 0;
    
    // Scatter plot data
    const scatterPoints: {x: number; y: number; size: number; color: string}[] = [];
    
    const initScatterPoints = () => {
      scatterPoints.length = 0;
      const numPoints = 40;
      const plotWidth = canvas.width * 0.7;
      const plotHeight = canvas.height * 0.3;
      const xStart = canvas.width * 0.15;
      const yStart = canvas.height * 0.15;
      
      for (let i = 0; i < numPoints; i++) {
        // Create clusters of points for a more realistic statistical scatter plot
        // Create 3-4 clusters
        const clusterIndex = Math.floor(Math.random() * 4);
        let xCluster, yCluster;
        
        switch (clusterIndex) {
          case 0:
            xCluster = 0.2 + Math.random() * 0.1;
            yCluster = 0.2 + Math.random() * 0.1;
            break;
          case 1:
            xCluster = 0.7 + Math.random() * 0.1;
            yCluster = 0.8 + Math.random() * 0.1;
            break;
          case 2:
            xCluster = 0.5 + Math.random() * 0.15;
            yCluster = 0.5 + Math.random() * 0.15;
            break;
          default:
            xCluster = 0.8 + Math.random() * 0.1;
            yCluster = 0.2 + Math.random() * 0.1;
        }
        
        // Add some random spread
        const x = xStart + (xCluster + (Math.random() - 0.5) * 0.1) * plotWidth;
        const y = yStart + (yCluster + (Math.random() - 0.5) * 0.1) * plotHeight;
        
        scatterPoints.push({
          x,
          y,
          size: Math.random() * 4 + 2,
          color: i % 2 === 0 ? primaryColor : accentColor
        });
      }
    };
    
    initScatterPoints();
    
    // Animate function with timing control
    const animate = (timestamp: number) => {
      if (!lastFrameTime) lastFrameTime = timestamp;
      
      const elapsed = timestamp - lastFrameTime;
      
      if (elapsed > frameInterval) {
        // Update animation time
        animationTime += elapsed / 1000; // Convert to seconds
        
        // Calculate delta for animation
        const delta = elapsed / frameInterval;
        
        // Update last frame time
        lastFrameTime = timestamp;
        
        // Clear canvas with a semi-transparent overlay for motion blur effect
        ctx.fillStyle = backgroundColor + 'f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update curve animation
        curvePhase += 0.01 * delta;
        updateCurvePoints(curvePhase);
        
        // Update bar heights with smooth animation
        bars.forEach(bar => {
          // Animate height towards target
          const diff = bar.targetHeight - bar.height;
          bar.height += diff * 0.05 * delta;
        });
        
        // Check if we need to update bar targets (every 5 seconds)
        if (Date.now() - lastBarUpdateTime > 5000) {
          updateBars();
        }
        
        // Draw scatter plot with connecting lines to nearby points
        ctx.strokeStyle = `${primaryColor}40`; // Light version of primary color
        ctx.lineWidth = 0.5;
        
        // Draw connecting lines first (so they appear behind points)
        for (let i = 0; i < scatterPoints.length; i++) {
          for (let j = i + 1; j < scatterPoints.length; j++) {
            const dx = scatterPoints[i].x - scatterPoints[j].x;
            const dy = scatterPoints[i].y - scatterPoints[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < canvas.width * 0.1) {
              const opacity = 1 - distance / (canvas.width * 0.1);
              ctx.globalAlpha = opacity * 0.3;
              ctx.beginPath();
              ctx.moveTo(scatterPoints[i].x, scatterPoints[i].y);
              ctx.lineTo(scatterPoints[j].x, scatterPoints[j].y);
              ctx.stroke();
            }
          }
        }
        
        ctx.globalAlpha = 1;
        
        // Draw scatter points
        scatterPoints.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = point.color;
          ctx.fill();
        });
        
        // Update and draw data points (network nodes)
        points.forEach(point => {
          // Update position with time-based animation
          point.x += point.vx * delta;
          point.y += point.vy * delta;
          
          // Bounce off edges
          if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
          if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
          
          // Draw point
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = point.color;
          ctx.fill();
        });
        
        // Draw connections between close points (network effect)
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
        
        // Draw animated distribution curve
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
        ctx.fillStyle = primaryColor + '30'; // With opacity
        ctx.fill();
        
        // Draw bar chart with animated values
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
          ctx.font = `${Math.max(12, canvas.width * 0.012)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(
            Math.round(bar.value * 100).toString(), 
            bar.x + bar.width / 2, 
            canvas.height * 0.9 - bar.height - 8
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
        
        // Animate scattered points with natural physics
        points.forEach(point => {
          // Add slight randomness to velocity for more natural movement
          point.vx += (Math.random() - 0.5) * 0.03 * delta;
          point.vy += (Math.random() - 0.5) * 0.03 * delta;
          
          // Limit velocity
          const maxVel = 0.8;
          const vel = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
          if (vel > maxVel) {
            point.vx = (point.vx / vel) * maxVel;
            point.vy = (point.vy / vel) * maxVel;
          }
        });
      }
      
      // Request next frame
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate(0);
    
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