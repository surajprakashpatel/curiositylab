import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './Contact.css';

const Contact = ({ textEnter, buttonEnter, defaultCursor }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulating form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Your message has been sent successfully!'
    });
    
    // Reset form after submission
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset form status after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: ''
      });
    }, 5000);
  };
  
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
  
  const itemVariants = {
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
  
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.4
      }
    }
  };
  
  const infoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2
      }
    }
  };
  
  const socialVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      scale: 1.2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onMouseEnter={textEnter}
          onMouseLeave={defaultCursor}
        >
          Get In Touch
        </motion.h2>
        
        <div className="contact-content">
          <motion.div 
            className="contact-info"
            variants={infoVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Let's Talk
            </motion.h3>
            
            <motion.p
              onMouseEnter={textEnter}
              onMouseLeave={defaultCursor}
            >
              Have a project in mind or just want to say hello? Feel free to reach out to me. I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </motion.p>
            
            <motion.div 
              className="contact-details"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div 
                className="contact-detail"
                variants={itemVariants}
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                <div className="detail-icon">📧</div>
                <div className="detail-text">
                  <h4>Email</h4>
                  <p>hello@example.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-detail"
                variants={itemVariants}
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                <div className="detail-icon">📱</div>
                <div className="detail-text">
                  <h4>Phone</h4>
                  <p>+1 (123) 456-7890</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-detail"
                variants={itemVariants}
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                <div className="detail-icon">📍</div>
                <div className="detail-text">
                  <h4>Location</h4>
                  <p>New York, USA</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="social-links"
              variants={socialVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.a 
                href="#" 
                className="social-link"
                variants={iconVariants}
                whileHover="hover"
                onMouseEnter={buttonEnter}
                onMouseLeave={defaultCursor}
              >
                <span className="social-icon">🐦</span>
              </motion.a>
              
              <motion.a 
                href="#" 
                className="social-link"
                variants={iconVariants}
                whileHover="hover"
                onMouseEnter={buttonEnter}
                onMouseLeave={defaultCursor}
              >
                <span className="social-icon">📸</span>
              </motion.a>
              
              <motion.a 
                href="#" 
                className="social-link"
                variants={iconVariants}
                whileHover="hover"
                onMouseEnter={buttonEnter}
                onMouseLeave={defaultCursor}
              >
                <span className="social-icon">💼</span>
              </motion.a>
              
              <motion.a 
                href="#" 
                className="social-link"
                variants={iconVariants}
                whileHover="hover"
                onMouseEnter={buttonEnter}
                onMouseLeave={defaultCursor}
              >
                <span className="social-icon">📱</span>
              </motion.a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="contact-form-container"
            variants={formVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {formStatus.submitted ? (
              <motion.div 
                className={`form-message ${formStatus.success ? 'success' : 'error'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {formStatus.message}
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <motion.input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    onMouseEnter={textEnter}
                    onMouseLeave={defaultCursor}
                  />
                </div>
                
                <div className="form-group">
                  <motion.input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    onMouseEnter={textEnter}
                    onMouseLeave={defaultCursor}
                  />
                </div>
                
                <div className="form-group">
                  <motion.input 
                    type="text" 
                    name="subject" 
                    placeholder="Subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    onMouseEnter={textEnter}
                    onMouseLeave={defaultCursor}
                  />
                </div>
                
                <div className="form-group">
                  <motion.textarea 
                    name="message" 
                    placeholder="Your Message"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    whileFocus={{ scale: 1.02 }}
                    onMouseEnter={textEnter}
                    onMouseLeave={defaultCursor}
                  ></motion.textarea>
                </div>
                
                <motion.button 
                  type="submit" 
                  className="btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={buttonEnter}
                  onMouseLeave={defaultCursor}
                >
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p onMouseEnter={textEnter} onMouseLeave={defaultCursor}>
          &copy; {new Date().getFullYear()} John Doe. All rights reserved.
        </p>
      </motion.footer>
    </section>
  );
};

export default Contact; 