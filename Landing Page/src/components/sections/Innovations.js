import React from 'react';
import { motion } from 'framer-motion';
import './Innovations.css';
import GradientText from '../../Effects/GradientText';

const Innovations = ({ textEnter, buttonEnter, defaultCursor }) => {
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
  
  const innovationProjects = [
    {
      id: 1,
      title: "NeuroSync AI",
      description: "A revolutionary neural interface that enables direct brain-computer communication for enhanced productivity and accessibility.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22731c9c22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["AI", "Neural Interface", "Accessibility"]
    },
    {
      id: 2,
      title: "EcoGrid",
      description: "Smart energy management system that optimizes power consumption and reduces carbon footprint through AI-driven analytics.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Clean Tech", "IoT", "AI"]
    },
    {
      id: 3,
      title: "MediChain",
      description: "Blockchain-based healthcare data management system ensuring secure, transparent, and efficient medical record keeping.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Blockchain", "Healthcare", "Security"]
    }
  ];
  
  return (
    <section id="innovations" className="innovations">
      <div className="container">
        <motion.div
          className="innovations-content"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="section-header" variants={itemVariants}>
            <div onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
              <GradientText
                colors={["#67e8f9", "#4079ff", "#67e8f9", "#4079ff", "#67e8f9"]}
                animationSpeed={6}
                showBorder={false}
                className="section-heading"
              >
                Groundbreaking Innovations
              </GradientText>
            </div>
            <p onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
              At Curiosity Lab, we're constantly pushing the boundaries of technology to create solutions that transform industries and improve lives.
            </p>
          </motion.div>
          
          <div className="innovation-projects">
            {innovationProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="innovation-card"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                <div className="innovation-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="innovation-details">
                  <GradientText
                    colors={["#67e8f9", "#4079ff", "#67e8f9", "#4079ff", "#67e8f9"]}
                    animationSpeed={6}
                    showBorder={false}
                    className="card-heading"
                  >
                    {project.title}
                  </GradientText>
                  <p>{project.description}</p>
                  <div className="innovation-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div className="innovation-vision" variants={itemVariants}>
            <div className="vision-content">
              <div onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
                <GradientText
                  colors={["#67e8f9", "#4079ff", "#67e8f9", "#4079ff", "#67e8f9"]}
                  animationSpeed={6}
                  showBorder={false}
                  className="sub-heading"
                >
                  Our Innovation Philosophy
                </GradientText>
              </div>
              <p onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
                We believe that technology should serve humanity, not the other way around. Our innovations are guided by principles of sustainability, accessibility, and ethical design. We're committed to creating solutions that address real-world challenges while considering their broader impact on society and the environment.
              </p>
              <motion.button
                className="btn"
                whileHover={{
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={buttonEnter}
                onMouseLeave={defaultCursor}
              >
                Explore Our Research
              </motion.button>
            </div>
            <div className="vision-image">
              <motion.div
                className="floating-shape"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Innovations; 