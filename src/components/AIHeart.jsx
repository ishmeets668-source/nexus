import React from 'react';

const AIHeart = () => {
  return (
    <div className="ai-heart-container" style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
      <svg viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 10px var(--neon-blue))' }}>
        <circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          stroke="var(--neon-blue)" 
          strokeWidth="1" 
          strokeDasharray="10 5"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 50 50" 
            to="360 50 50" 
            dur="10s" 
            repeatCount="indefinite" 
          />
        </circle>
        <circle 
          cx="50" cy="50" r="35" 
          fill="none" 
          stroke="var(--neon-purple)" 
          strokeWidth="2" 
          strokeDasharray="5 10"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="360 50 50" 
            to="0 50 50" 
            dur="5s" 
            repeatCount="indefinite" 
          />
        </circle>
        <path 
          d="M50 30 L60 50 L50 70 L40 50 Z" 
          fill="var(--neon-blue)" 
          opacity="0.8"
        >
          <animate 
            attributeName="opacity" 
            values="0.4;0.8;0.4" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </path>
      </svg>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        fontSize: '0.8rem',
        color: 'var(--neon-blue)',
        textAlign: 'center'
      }}>
        CPU LOAD<br/>42%
      </div>
    </div>
  );
};

export default AIHeart;
