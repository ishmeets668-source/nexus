import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import './RobotCursor.css';

const RobotCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Rotation animation for the rings
  const rotation = useMotionValue(0);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setCoords({ x: Math.floor(e.clientX), y: Math.floor(e.clientY) });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('interactive') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
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
    <div className={`robot-cursor-container ${isHovering ? 'is-hovering' : ''} ${isClicking ? 'is-clicking' : ''}`}>
      <motion.div
        className="cursor-main"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      >
        {/* Central Glowing Dot */}
        <motion.div 
          className="cursor-dot"
          animate={{
            scale: isClicking ? 0.8 : (isHovering ? 1.5 : 1),
            backgroundColor: isHovering ? 'var(--neon-purple)' : '#fff'
          }}
        />

        {/* Inner Rotating Ring */}
        <div className="cursor-ring-inner" />

        {/* Outer Pulsing Ring */}
        <motion.div 
          className="cursor-ring-outer"
          animate={{
            scale: isClicking ? 1.5 : (isHovering ? 1.2 : 1),
            opacity: isClicking ? 1 : 0.5,
            borderColor: isClicking ? 'var(--neon-pink)' : (isHovering ? 'var(--neon-purple)' : 'var(--neon-blue)')
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* HUD Brackets */}
        <div className="cursor-bracket bracket-tl" />
        <div className="cursor-bracket bracket-tr" />
        <div className="cursor-bracket bracket-bl" />
        <div className="cursor-bracket bracket-br" />

        {/* Dynamic Tech Text */}
        <div className="cursor-text">
          {isHovering ? 'TARGET_LOCK' : `HUD_PTR [${coords.x}:${coords.y}]`}
        </div>
      </motion.div>
    </div>
  );
};

export default RobotCursor;

