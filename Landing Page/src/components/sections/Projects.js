import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Projects.css';

const Projects = ({ textEnter, buttonEnter, defaultCursor }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  // Projects data
  const projects = [
    {
      id: 1,
      title: "E-Commerce Website",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "A modern e-commerce platform with dynamic product filtering and animations."
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "User-friendly banking application with intuitive interface and secure transactions."
    },
    {
      id: 3,
      title: "Portfolio Website",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "Creative portfolio showcasing work with interactive elements and smooth animations."
    },
    {
      id: 4,
      title: "Social Media Dashboard",
      category: "Web Application",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1015&q=80",
      description: "Comprehensive dashboard for managing multiple social media accounts with analytics."
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const projectVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <section id="projects" className="projects">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onMouseEnter={textEnter}
          onMouseLeave={defaultCursor}
        >
          My Projects
        </motion.h2>
        
        <motion.div 
          className="projects-grid"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((project) => (
            <motion.div 
              className="project-card"
              key={project.id}
              variants={projectVariants}
              whileHover={{ y: -10 }}
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <motion.div 
                    className="project-buttons"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button 
                      className="project-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={buttonEnter}
                      onMouseLeave={textEnter}
                    >
                      View Project
                    </motion.button>
                    <motion.button 
                      className="project-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={buttonEnter}
                      onMouseLeave={textEnter}
                    >
                      Source Code
                    </motion.button>
                  </motion.div>
                </div>
              </div>
              <div className="project-info">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="view-more"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button 
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={buttonEnter}
            onMouseLeave={defaultCursor}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 