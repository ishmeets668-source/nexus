import React, { useEffect, useRef, useState } from 'react';

const AIHeart = () => {
  const canvasRef = useRef(null);
  const [load, setLoad] = useState(42);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const nodes = [];
    const nodeCount = 50;
    const maxDistance = 80;

    class Node {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = 0.02 + Math.random() * 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const opacity = (Math.sin(this.pulse) + 1) / 2 * 0.5 + 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, ${opacity})`;
        ctx.fill();
        
        // Bloom effect for node
        if (opacity > 0.6) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'var(--neon-blue)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
      }
    }

    for (let i = 0; i < nodeCount; i++) nodes.push(new Node());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((n, i) => {
        n.update();
        n.draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            
            // Draw curved synapse lines
            const cx = (n.x + n2.x) / 2 + Math.sin(Date.now() * 0.001 + i) * 10;
            const cy = (n.y + n2.y) / 2 + Math.cos(Date.now() * 0.001 + j) * 10;
            
            ctx.quadraticCurveTo(cx, cy, n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Firing impulse animation
            if (Math.random() > 0.995) {
                const impulseOpacity = opacity * 2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${impulseOpacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const loadInterval = setInterval(() => {
        setLoad(Math.floor(40 + Math.random() * 10));
    }, 2000);

    return () => {
        cancelAnimationFrame(animationFrameId);
        clearInterval(loadInterval);
    };
  }, []);

  return (
    <div className="neural-viz-wrapper">
      <div className="viz-container">
        {/* Background Neural Web */}
        <canvas ref={canvasRef} width={300} height={300} className="neural-canvas" />
        
        {/* SVG HUD Layers */}
        <svg viewBox="0 0 100 100" className="hud-svg">
          <defs>
            <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-blue)" />
              <stop offset="100%" stopColor="var(--neon-purple)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer Rotating Gear */}
          <g className="rotate-slow">
            {[...Array(12)].map((_, i) => (
                <rect 
                    key={i} 
                    x="48" y="2" width="4" height="2" 
                    fill="var(--neon-blue)" 
                    opacity="0.3" 
                    transform={`rotate(${i * 30} 50 50)`} 
                />
            ))}
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--neon-blue)" strokeWidth="0.1" strokeDasharray="1 3" />
          </g>

          {/* Hexagon Grid Overlay */}
          <path 
            d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" 
            fill="none" 
            stroke="var(--neon-blue)" 
            strokeWidth="0.8" 
            strokeDasharray="2 2"
            opacity="0.3"
            className="rotate-med"
          />

          {/* Active Data Rings */}
          <circle 
            cx="50" cy="50" r="42" 
            fill="none" 
            stroke="url(#coreGradient)" 
            strokeWidth="0.5" 
            strokeDasharray="10 20"
            filter="url(#glow)"
            className="rotate-fast"
          />
          
          <circle 
            cx="50" cy="50" r="38" 
            fill="none" 
            stroke="var(--neon-blue)" 
            strokeWidth="2" 
            strokeDasharray="60 40"
            filter="url(#glow)"
            className="rotate-fast"
            style={{ animationDuration: '4s' }}
          />
          
          <circle 
            cx="50" cy="50" r="34" 
            fill="none" 
            stroke="var(--neon-purple)" 
            strokeWidth="0.5" 
            strokeDasharray="5 15"
            className="rotate-reverse"
          />

          {/* Core Sphere */}
          <circle 
            cx="50" cy="50" r="14" 
            fill="url(#coreGradient)" 
            filter="url(#glow)"
            className="core-pulse-v2"
          />
          
          <circle 
            cx="50" cy="50" r="10" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.2"
            opacity="0.5"
          />
          
          {/* Scanning Line */}
          <line x1="20" y1="50" x2="80" y2="50" stroke="var(--neon-blue)" strokeWidth="0.2" opacity="0.5">
            <animateTransform attributeName="transform" type="translate" values="0 -30; 0 30; 0 -30" dur="4s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Floating Data Labels */}
        <div className="floating-data tl">SYNC: ACTIVE</div>
        <div className="floating-data tr">NODES: 512</div>
        <div className="floating-data bl">FREQ: 5.2GHz</div>
        <div className="floating-data br">VOLT: 1.2V</div>

        {/* Central Display */}
        <div className="central-stat">
          <div className="stat-label">NEURAL_LOAD</div>
          <div className="stat-val">{load}%</div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .neural-viz-wrapper {
          width: 100%;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }
        .viz-container {
          position: relative;
          width: 280px;
          height: 280px;
          transform-style: preserve-3d;
          animation: container-float 6s ease-in-out infinite;
        }
        @keyframes container-float {
          0%, 100% { transform: rotateX(10deg) rotateY(-5deg); }
          50% { transform: rotateX(15deg) rotateY(5deg); }
        }
        .neural-canvas {
          position: absolute;
          inset: 0;
          opacity: 0.6;
          filter: blur(0.5px);
        }
        .hud-svg {
          position: absolute;
          inset: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          z-index: 5;
          pointer-events: none;
        }
        .rotate-slow { animation: rot 30s linear infinite; transform-origin: center; }
        .rotate-med { animation: rot 20s linear infinite; transform-origin: center; }
        .rotate-fast { animation: rot 10s linear infinite; transform-origin: center; }
        .rotate-reverse { animation: rot 15s linear infinite reverse; transform-origin: center; }
        @keyframes rot {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .core-pulse-v2 {
          animation: core-beat 2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes core-beat {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; filter: brightness(1.5) blur(2px); }
        }
        .floating-data {
          position: absolute;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          color: var(--neon-blue);
          opacity: 0.6;
          padding: 2px 5px;
          border-left: 1px solid var(--neon-blue);
        }
        .tl { top: 10%; left: 0; }
        .tr { top: 10%; right: 0; border-left: 0; border-right: 1px solid var(--neon-blue); }
        .bl { bottom: 10%; left: 0; }
        .br { bottom: 10%; right: 0; border-left: 0; border-right: 1px solid var(--neon-blue); }
        
        .central-stat {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          pointer-events: none;
        }
        .stat-label {
          font-size: 0.4rem;
          color: var(--text-dim);
          letter-spacing: 2px;
        }
        .stat-val {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          color: white;
          text-shadow: 0 0 10px var(--neon-blue);
        }
      `}} />
    </div>
  );
};

export default AIHeart;
