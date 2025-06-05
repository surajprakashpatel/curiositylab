import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Skills.css';

const Skills = ({ textEnter, buttonEnter, defaultCursor }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  // Skills data
  const frontendSkills = [
    { name: "HTML5", icon: "💻", level: 95 },
    { name: "CSS3", icon: "🎨", level: 90 },
    { name: "JavaScript", icon: "📜", level: 92 },
    { name: "React", icon: "⚛️", level: 88 },
    { name: "Framer Motion", icon: "✨", level: 85 }
  ];
  
  const backendSkills = [
    { name: "Node.js", icon: "🚀", level: 80 },
    { name: "Express", icon: "🛠️", level: 82 },
    { name: "MongoDB", icon: "🗄️", level: 78 },
    { name: "GraphQL", icon: "📊", level: 75 },
    { name: "Firebase", icon: "🔥", level: 85 }
  ];
  
  const designSkills = [
    { name: "Figma", icon: "🖌️", level: 90 },
    { name: "Adobe XD", icon: "📱", level: 85 },
    { name: "Photoshop", icon: "🖼️", level: 80 },
    { name: "Illustrator", icon: "✏️", level: 75 },
    { name: "UI/UX", icon: "👁️", level: 88 }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const skillVariants = {
    hidden: { y: 20, opacity: 0 },
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
  
  // Skill bar animation
  const SkillBar = ({ skill }) => {
    const barRef = useRef(null);
    const barInView = useInView(barRef, { once: false, amount: 0.5 });
    
    return (
      <motion.div 
        className="skill-item"
        variants={skillVariants}
        ref={barRef}
        onMouseEnter={textEnter}
        onMouseLeave={defaultCursor}
      >
        <div className="skill-header">
          <div className="skill-icon">{skill.icon}</div>
          <h3 className="skill-name">{skill.name}</h3>
          <span className="skill-level">{skill.level}%</span>
        </div>
        <div className="skill-bar">
          <motion.div 
            className="skill-progress"
            initial={{ width: 0 }}
            animate={barInView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          ></motion.div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <section id="skills" className="skills-section">
      <div className="container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onMouseEnter={textEnter}
          onMouseLeave={defaultCursor}
        >
          My Skills
        </motion.h2>
        
        <div className="skills-content">
          <div className="skills-category">
            <motion.h3
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Frontend Development
            </motion.h3>
            
            <motion.div 
              className="skills-list"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {frontendSkills.map((skill, index) => (
                <SkillBar key={`frontend-${index}`} skill={skill} />
              ))}
            </motion.div>
          </div>
          
          <div className="skills-category">
            <motion.h3
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Backend Development
            </motion.h3>
            
            <motion.div 
              className="skills-list"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={1}
            >
              {backendSkills.map((skill, index) => (
                <SkillBar key={`backend-${index}`} skill={skill} />
              ))}
            </motion.div>
          </div>
          
          <div className="skills-category">
            <motion.h3
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Design
            </motion.h3>
            
            <motion.div 
              className="skills-list"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={2}
            >
              {designSkills.map((skill, index) => (
                <SkillBar key={`design-${index}`} skill={skill} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="skills-background"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </section>
  );
};

export default Skills; 