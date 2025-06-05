import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ textEnter, buttonEnter, defaultCursor }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        delay: 0.2 
      } 
    }
  };
  
  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: i => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: i * 0.1 + 0.3,
        type: "spring", 
        stiffness: 100 
      } 
    })
  };
  
  const mobileMenuVariants = {
    closed: { 
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const mobileNavItemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    }
  };
  
  return (
    <motion.header
      className="header"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container header-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          onMouseEnter={textEnter}
          onMouseLeave={defaultCursor}
        >
          Curiosity Lab
        </motion.div>
        
        <nav className="desktop-nav">
          <ul>
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item, i) => (
              <motion.li 
                key={item}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.a 
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.1, color: "var(--secondary)" }}
                  onMouseEnter={textEnter}
                  onMouseLeave={defaultCursor}
                >
                  {item}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </nav>
        
        <motion.div 
          className="menu-toggle"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={buttonEnter}
          onMouseLeave={defaultCursor}
        >
          <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      </div>
      
      {/* Mobile Menu */}
      <motion.div 
        className="mobile-menu"
        variants={mobileMenuVariants}
        initial="closed"
        animate={menuOpen ? "open" : "closed"}
      >
        <ul>
          {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
            <motion.li 
              key={item}
              variants={mobileNavItemVariants}
            >
              <a 
                href={`#${item.toLowerCase()}`}
                onClick={toggleMenu}
                onMouseEnter={textEnter}
                onMouseLeave={defaultCursor}
              >
                {item}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.header>
  );
};

export default Header; 