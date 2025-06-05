import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Cursor.css';

const Cursor = ({ cursorVariant }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener("mousemove", mouseMove);
    
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);
  
  // Cursor variants
  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      mixBlendMode: "difference"
    },
    text: {
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      height: 150,
      width: 150,
      backgroundColor: "var(--primary)",
      mixBlendMode: "difference"
    },
    button: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "var(--secondary)",
      mixBlendMode: "difference"
    }
  };
  
  return (
    <>
      <motion.div 
        className="cursor-dot"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: "spring", mass: 0.1, stiffness: 1000, damping: 50 }}
      />
      <motion.div 
        className="cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", mass: 0.6, stiffness: 200, damping: 30 }}
      />
    </>
  );
};

export default Cursor; 