import { useEffect, useRef } from 'react';

export default function SustainableBackground() {
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
    
    // Sustainable green color scheme
    const primaryGreen = '#1B5E20';
    const secondaryGreen = '#2E7D32';
    const accentGreen = '#43A047';
    const lightGreen = '#81C784';
    const waterBlue = '#1976D2';
    const lightBlue = '#42A5F5';
    const backgroundColor = '#0A1A0A';
    
    // Water molecules (H2O structures)
    const waterMolecules: {x: number; y: number; vx: number; vy: number; rotation: number; rotationSpeed: number}[] = [];
    const numMolecules = Math.min(Math.floor(canvas.width * canvas.height / 8000), 30);
    
    for (let i = 0; i < numMolecules; i++) {
      waterMolecules.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
    
    // Sustainable material particles (representing solar panels, wind turbines, etc.)
    const materialParticles: {x: number; y: number; vx: number; vy: number; type: 'solar' | 'wind' | 'leaf' | 'battery'; size: number}[] = [];
    const numParticles = Math.min(Math.floor(canvas.width * canvas.height / 12000), 40);
    
    const particleTypes: ('solar' | 'wind' | 'leaf' | 'battery')[] = ['solar', 'wind', 'leaf', 'battery'];
    
    for (let i = 0; i < numParticles; i++) {
      materialParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        size: Math.random() * 8 + 4
      });
    }
    
    // Energy flow lines
    const energyFlows: {startX: number; startY: number; endX: number; endY: number; progress: number; speed: number}[] = [];
    const numFlows = Math.min(Math.floor(canvas.width * canvas.height / 15000), 20);
    
    for (let i = 0; i < numFlows; i++) {
      energyFlows.push({
        startX: Math.random() * canvas.width,
        startY: Math.random() * canvas.height,
        endX: Math.random() * canvas.width,
        endY: Math.random() * canvas.height,
        progress: Math.random(),
        speed: Math.random() * 0.01 + 0.005
      });
    }
    
    // Benzene rings and graphene structures
    const benzeneRings: {x: number; y: number; vx: number; vy: number; rotation: number; rotationSpeed: number; radius: number}[] = [];
    const numBenzene = Math.min(Math.floor(canvas.width * canvas.height / 25000), 15);
    
    for (let i = 0; i < numBenzene; i++) {
      benzeneRings.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        radius: Math.random() * 20 + 25
      });
    }
    
    // Graphene lattice structure
    const grapheneNodes: {x: number; y: number; vx: number; vy: number; connections: number[]}[] = [];
    const numGrapheneNodes = Math.min(Math.floor(canvas.width * canvas.height / 18000), 30);
    
    for (let i = 0; i < numGrapheneNodes; i++) {
      grapheneNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        connections: []
      });
    }
    
    // Create hexagonal connections for graphene-like structure
    grapheneNodes.forEach((node, i) => {
      grapheneNodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < canvas.width * 0.12 && node.connections.length < 3) {
            node.connections.push(j);
          }
        }
      });
    });
    
    // Animation variables
    let animationTime = 0;
    let lastFrameTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;
    
    // Draw water molecule (H2O)
    const drawWaterMolecule = (x: number, y: number, rotation: number, scale: number = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      
      // Oxygen (center, larger, red-ish)
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = waterBlue;
      ctx.fill();
      ctx.strokeStyle = lightBlue;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Hydrogen atoms (smaller, lighter)
      ctx.beginPath();
      ctx.arc(-12, -8, 4, 0, Math.PI * 2);
      ctx.fillStyle = lightBlue;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(12, -8, 4, 0, Math.PI * 2);
      ctx.fillStyle = lightBlue;
      ctx.fill();
      
      // Bonds
      ctx.strokeStyle = lightBlue + '80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-12, -8);
      ctx.moveTo(0, 0);
      ctx.lineTo(12, -8);
      ctx.stroke();
      
      ctx.restore();
    };
    
    // Draw benzene ring (C6H6)
    const drawBenzeneRing = (x: number, y: number, rotation: number, radius: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Draw hexagon (carbon ring)
      ctx.strokeStyle = primaryGreen;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const vertexX = Math.cos(angle) * radius;
        const vertexY = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(vertexX, vertexY);
        } else {
          ctx.lineTo(vertexX, vertexY);
        }
        
        // Draw carbon atoms at vertices
        ctx.save();
        ctx.fillStyle = accentGreen;
        ctx.beginPath();
        ctx.arc(vertexX, vertexY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.closePath();
      ctx.stroke();
      
      // Draw alternating double bonds (benzene resonance)
      ctx.strokeStyle = secondaryGreen;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 6; i += 2) {
        const angle1 = (i * Math.PI * 2) / 6;
        const angle2 = ((i + 1) * Math.PI * 2) / 6;
        
        const x1 = Math.cos(angle1) * (radius * 0.8);
        const y1 = Math.sin(angle1) * (radius * 0.8);
        const x2 = Math.cos(angle2) * (radius * 0.8);
        const y2 = Math.sin(angle2) * (radius * 0.8);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      ctx.restore();
    };
    
    // Draw graphene lattice structure
    const drawGrapheneLattice = (nodes: {x: number; y: number; connections: number[]}[]) => {
      // Draw connections first
      ctx.strokeStyle = primaryGreen + '80';
      ctx.lineWidth = 1.5;
      
      nodes.forEach((node, i) => {
        node.connections.forEach(connIndex => {
          if (connIndex < nodes.length && connIndex > i) { // Avoid drawing same connection twice
            const connNode = nodes[connIndex];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connNode.x, connNode.y);
            ctx.stroke();
          }
        });
      });
      
      // Draw carbon atoms
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = secondaryGreen;
        ctx.fill();
        ctx.strokeStyle = accentGreen;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    // Draw sustainable material icons
    const drawMaterialParticle = (x: number, y: number, type: 'solar' | 'wind' | 'leaf' | 'battery', size: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      switch (type) {
        case 'solar':
          // Solar panel representation
          ctx.fillStyle = primaryGreen;
          ctx.fillRect(-size/2, -size/2, size, size);
          ctx.strokeStyle = accentGreen;
          ctx.lineWidth = 1;
          ctx.strokeRect(-size/2, -size/2, size, size);
          // Grid lines
          ctx.beginPath();
          ctx.moveTo(-size/2, 0);
          ctx.lineTo(size/2, 0);
          ctx.moveTo(0, -size/2);
          ctx.lineTo(0, size/2);
          ctx.stroke();
          break;
          
        case 'wind':
          // Wind turbine blade
          ctx.strokeStyle = lightGreen;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, size/2, 0, Math.PI * 2);
          ctx.stroke();
          // Blades
          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size/2, Math.sin(angle) * size/2);
            ctx.stroke();
          }
          break;
          
        case 'leaf':
          // Leaf shape
          ctx.fillStyle = secondaryGreen;
          ctx.beginPath();
          ctx.ellipse(0, 0, size/3, size/2, Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = accentGreen;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -size/2);
          ctx.lineTo(0, size/2);
          ctx.stroke();
          break;
          
        case 'battery':
          // Battery shape
          ctx.fillStyle = primaryGreen;
          ctx.fillRect(-size/3, -size/2, size*2/3, size);
          ctx.fillStyle = accentGreen;
          ctx.fillRect(-size/4, -size/3, size/2, size*2/3);
          ctx.strokeStyle = lightGreen;
          ctx.lineWidth = 1;
          ctx.strokeRect(-size/3, -size/2, size*2/3, size);
          break;
      }
      
      ctx.restore();
    };
    
    // Main animation loop
    const animate = (timestamp: number) => {
      if (!lastFrameTime) lastFrameTime = timestamp;
      
      const elapsed = timestamp - lastFrameTime;
      
      if (elapsed > frameInterval) {
        animationTime += elapsed / 1000;
        const delta = elapsed / frameInterval;
        lastFrameTime = timestamp;
        
        // Clear canvas with dark green background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw subtle grid (representing molecular structure)
        ctx.strokeStyle = primaryGreen + '20';
        ctx.lineWidth = 0.5;
        
        const gridSize = Math.min(canvas.width, canvas.height) / 20;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Update and draw benzene rings
        benzeneRings.forEach(ring => {
          ring.x += ring.vx * delta;
          ring.y += ring.vy * delta;
          ring.rotation += ring.rotationSpeed * delta;
          
          // Bounce off edges
          if (ring.x < ring.radius || ring.x > canvas.width - ring.radius) ring.vx *= -1;
          if (ring.y < ring.radius || ring.y > canvas.height - ring.radius) ring.vy *= -1;
          
          // Draw benzene ring
          drawBenzeneRing(ring.x, ring.y, ring.rotation, ring.radius);
        });
        
        // Update and draw graphene lattice
        grapheneNodes.forEach((node, i) => {
          // Update position
          node.x += node.vx * delta;
          node.y += node.vy * delta;
          
          // Bounce off edges
          if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });
        
        // Draw graphene lattice structure
        drawGrapheneLattice(grapheneNodes);
        
        // Update and draw energy flows
        energyFlows.forEach(flow => {
          flow.progress += flow.speed * delta;
          if (flow.progress > 1) {
            flow.progress = 0;
            // Regenerate random endpoints
            flow.startX = Math.random() * canvas.width;
            flow.startY = Math.random() * canvas.height;
            flow.endX = Math.random() * canvas.width;
            flow.endY = Math.random() * canvas.height;
          }
          
          // Draw energy flow
          const currentX = flow.startX + (flow.endX - flow.startX) * flow.progress;
          const currentY = flow.startY + (flow.endY - flow.startY) * flow.progress;
          
          const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 15);
          gradient.addColorStop(0, accentGreen + 'ff');
          gradient.addColorStop(1, accentGreen + '00');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
          ctx.fill();
          
          // Trail effect
          if (flow.progress > 0.1) {
            const trailX = flow.startX + (flow.endX - flow.startX) * (flow.progress - 0.1);
            const trailY = flow.startY + (flow.endY - flow.startY) * (flow.progress - 0.1);
            
            ctx.strokeStyle = lightGreen + '60';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(trailX, trailY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
          }
        });
        
        // Update and draw water molecules
        waterMolecules.forEach(molecule => {
          molecule.x += molecule.vx * delta;
          molecule.y += molecule.vy * delta;
          molecule.rotation += molecule.rotationSpeed * delta;
          
          // Bounce off edges
          if (molecule.x < 30 || molecule.x > canvas.width - 30) molecule.vx *= -1;
          if (molecule.y < 30 || molecule.y > canvas.height - 30) molecule.vy *= -1;
          
          // Draw water molecule
          drawWaterMolecule(molecule.x, molecule.y, molecule.rotation, 0.8);
        });
        
        // Update and draw material particles
        materialParticles.forEach(particle => {
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;
          
          // Bounce off edges
          if (particle.x < particle.size || particle.x > canvas.width - particle.size) particle.vx *= -1;
          if (particle.y < particle.size || particle.y > canvas.height - particle.size) particle.vy *= -1;
          
          // Draw material particle
          drawMaterialParticle(particle.x, particle.y, particle.type, particle.size);
        });
        
        // Draw floating sustainability text/symbols occasionally
        if (Math.sin(animationTime * 0.5) > 0.8) {
          ctx.fillStyle = lightGreen + '60';
          ctx.font = `${Math.max(14, canvas.width * 0.015)}px sans-serif`;
          ctx.textAlign = 'center';
          
          const symbols = ['♻️', '🌱', '💧', '⚡', '🌿', '☀️'];
          symbols.forEach((symbol, i) => {
            const x = (canvas.width / symbols.length) * (i + 0.5);
            const y = canvas.height * 0.1 + Math.sin(animationTime + i) * 20;
            ctx.fillText(symbol, x, y);
          });
        }
        
        // Add subtle wave effect (representing water flow)
        ctx.strokeStyle = waterBlue + '40';
        ctx.lineWidth = 2;
        
        for (let wave = 0; wave < 3; wave++) {
          ctx.beginPath();
          const waveY = canvas.height * (0.2 + wave * 0.3);
          const amplitude = 30;
          const frequency = 0.01;
          const phase = animationTime * 0.5 + wave * Math.PI / 3;
          
          for (let x = 0; x <= canvas.width; x += 5) {
            const y = waveY + Math.sin(x * frequency + phase) * amplitude;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }
      
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
