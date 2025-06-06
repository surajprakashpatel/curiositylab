import React from 'react';
import { motion } from 'framer-motion';
import './Consultancy.css';
import GradientText from '../../Effects/GradientText';

const Consultancy = ({ textEnter, buttonEnter, defaultCursor }) => {
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
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: i => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: i * 0.1
      }
    }),
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  const consultingServices = [
    {
      id: 1,
      title: "Technology Strategy",
      description: "Strategic technology planning to align with your business goals and drive innovation.",
      icon: "💡"
    },
    {
      id: 2,
      title: "Digital Transformation",
      description: "End-to-end guidance on transforming your business through cutting-edge digital solutions.",
      icon: "🔄"
    },
    {
      id: 3,
      title: "AI & Machine Learning",
      description: "Expert consulting on implementing AI and ML solutions to solve complex business problems.",
      icon: "🤖"
    },
    {
      id: 4,
      title: "IoT Implementation",
      description: "Strategic planning and execution of IoT initiatives to connect your business to the future.",
      icon: "📱"
    }
  ];
  
  return (
    <section id="consultancy" className="consultancy">
      <div className="container">
        <motion.div
          className="consultancy-content"
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
                Expert Consultancy
              </GradientText>
            </div>
            <p onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
              While we're passionate about creating innovative technology, we also offer specialized consulting services to help businesses navigate the complex digital landscape.
            </p>
          </motion.div>
          
          <div className="consultancy-services">
            {consultingServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="service-card"
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                <div className="service-icon">{service.icon}</div>
                <GradientText
                  colors={["#67e8f9", "#4079ff", "#67e8f9", "#4079ff", "#67e8f9"]}
                  animationSpeed={6}
                  showBorder={false}
                  className="service-title"
                >
                  {service.title}
                </GradientText>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div className="consultancy-cta" variants={itemVariants}>
            <p onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
              Our team of industry experts brings decades of experience to help you navigate technological challenges and opportunities.
            </p>
            <motion.button
              className="btn"
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: {
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                },
                tap: { scale: 0.95 }
              }}
              onMouseEnter={buttonEnter}
              onMouseLeave={defaultCursor}
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Consultancy; 