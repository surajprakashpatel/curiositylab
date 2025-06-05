import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './About.css';

const About = ({ textEnter, buttonEnter, defaultCursor }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
  
  // Skills data
  const skills = [
    { name: "Web Development", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "Animation", level: 80 },
    { name: "Mobile Development", level: 75 }
  ];
  
  return (
    <section id="about" className="about">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onMouseEnter={textEnter}
          onMouseLeave={defaultCursor}
        >
          About Us
        </motion.h2>
        
        <div className="about-content" ref={ref}>
          <motion.div 
            className="about-image"
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="image-container"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="image-overlay"></div>
              <motion.div 
                className="floating-shape shape-1"
                animate={{
                  rotate: [0, 360],
                  x: [0, 10, 0],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="floating-shape shape-2"
                animate={{
                  rotate: [0, -360],
                  x: [0, -10, 0],
                  y: [0, 10, 0]
                }}
                transition={{
                  duration: 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="about-text"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3 
              variants={itemVariants}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Who we are?
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              We are a team of passionate developers and designers who are dedicated in tech solutions helping you elevate you business with beautiful functional websites ,applications ,softwares ,portfolios etc.
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Our approach combines technical expertise with creative design thinking to deliver exceptional user experiences. I specialize in modern front-end technologies and interactive animations.
            </motion.p>
            
            <motion.div 
              className="skills"
              variants={itemVariants}
            >
              <h4
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                Our Skills
              </h4>
              
              <div className="skill-bars">
                {skills.map((skill, index) => (
                  <div className="skill" key={index}>
                    <div className="skill-info">
                      <span 
                        className="skill-name"
                        onMouseEnter={textEnter}
                        onMouseLeave={defaultCursor}
                      >
                        {skill.name}
                      </span>
                      <span 
                        className="skill-percentage"
                        onMouseEnter={textEnter}
                        onMouseLeave={defaultCursor}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-bar">
                      <motion.div 
                        className="skill-progress"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 * index }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.button 
              className="btn"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={buttonEnter}
              onMouseLeave={defaultCursor}
            >
              Download CV
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 