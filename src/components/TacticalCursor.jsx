import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './TacticalCursor.css';

const TacticalCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (window.getComputedStyle(target).cursor === 'pointer') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className={`tactical-cursor-container ${isHovering ? 'is-hovering' : ''} ${isClicking ? 'is-clicking' : ''}`}>
      <motion.div
        className="cursor-wrapper"
        style={{
          left: springX,
          top: springY,
        }}
      >
        {/* Main Diamond Shard */}
        <motion.div 
          className="cursor-shard"
          animate={{
            rotate: isHovering ? 45 : 0,
            scale: isClicking ? 0.7 : 1,
            backgroundColor: isHovering ? 'var(--neon-purple)' : 'var(--neon-blue)'
          }}
        />

        {/* Orbiting Points */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`cursor-point point-${i}`}
            animate={{
              rotate: 360,
              scale: isHovering ? 1.5 : 1,
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 4, ease: "linear" },
              scale: { duration: 0.3 }
            }}
          />
        ))}

        {/* Target Frame */}
        <motion.div 
          className="target-frame"
          animate={{
            width: isHovering ? 50 : 0,
            height: isHovering ? 50 : 0,
            opacity: isHovering ? 1 : 0,
            rotate: isHovering ? 90 : 0
          }}
        />
      </motion.div>
    </div>
  );
};

export default TacticalCursor;
