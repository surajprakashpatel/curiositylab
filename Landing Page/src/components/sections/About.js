import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './About.css';
import GradientText from '../../Effects/GradientText';

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
  
  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onMouseEnter={textEnter}
          onMouseLeave={defaultCursor}
        >
          <GradientText
            colors={["#67e8f9", "#4079ff", "#67e8f9", "#4079ff", "#67e8f9"]}
            animationSpeed={6}
            showBorder={false}
            className="section-heading"
          >
            About Us
          </GradientText>
        </motion.div>
        
        <div className="about-content" ref={ref}>
          <motion.div 
            className="about-text"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ width: '100%' }}
          >
            <motion.div 
              variants={itemVariants}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              <GradientText
                colors={["#67e8f9", "#4079ff", "#67e8f9", "#4079ff", "#67e8f9"]}
                animationSpeed={6}
                showBorder={false}
                className="sub-heading"
              >
                Who we are?
              </GradientText>
            </motion.div>
            
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