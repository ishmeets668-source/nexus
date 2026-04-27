import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './SimpleCursor.css';

const SimpleCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (window.getComputedStyle(target).cursor === 'pointer') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="simple-cursor-container">
      {/* Lagging Ring */}
      <motion.div
        className="cursor-ring"
        style={{
          left: springX,
          top: springY,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? 'var(--neon-purple)' : 'var(--neon-blue)',
        }}
      />
      {/* Precise Dot */}
      <motion.div
        className="cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
        }}
      />
    </div>
  );
};

export default SimpleCursor;
