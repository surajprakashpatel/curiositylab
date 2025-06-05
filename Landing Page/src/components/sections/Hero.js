import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ textEnter, buttonEnter, defaultCursor }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 1.2
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };
  
  // Split text animation
  const sentence = "Creative Developer & Designer";
  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.04
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  
  return (
    <section id="home" className="hero">
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            onMouseEnter={textEnter}
            onMouseLeave={defaultCursor}
          >
            We Are <span className="highlight">Curiosity Lab</span>
          </motion.h1>
          
          <motion.div
            className="animated-text"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
            onMouseEnter={textEnter}
            onMouseLeave={defaultCursor}
          >
            {sentence.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={letterVariants}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            onMouseEnter={textEnter}
            onMouseLeave={defaultCursor}
          >
            We will help you elevate your brand with our creative and innovative tech solutions.
          </motion.p>
          
          <div className="hero-buttons">
            <motion.button 
              className="btn"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={buttonEnter}
              onMouseLeave={defaultCursor}
            >
              View Our Work
            </motion.button>
            
            <motion.button 
              className="btn btn-outline"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={buttonEnter}
              onMouseLeave={defaultCursor}
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
        
        <div className="hero-image">
          <motion.div 
            className="blob"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
              borderRadius: ["40% 60% 60% 40% / 60% 30% 70% 40%", "40% 60% 70% 30% / 50% 60% 40% 50%", "40% 60% 60% 40% / 60% 30% 70% 40%"]
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div 
            className="floating-image"
            initial={{ y: 0 }}
            animate={{ y: [-20, 20, -20] }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </div>
      
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            delay: 2,
            duration: 1
          }
        }}
      >
        <motion.div 
          className="scroll-dot"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.div>
    </section>
  );
};

export default Hero; 