import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import './components/sections/SectionHeadings.css';

// Import sections
import Header from './components/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Innovations from './components/sections/Innovations';
import Projects from './components/sections/Projects';
import Consultancy from './components/sections/Consultancy';
import Contact from './components/sections/Contact';
import Cursor from './components/Cursor';

function App() {
  const [cursorVariant, setCursorVariant] = useState("default");

  // Custom cursor handlers
  const textEnter = () => setCursorVariant("text");
  const buttonEnter = () => setCursorVariant("button");
  const defaultCursor = () => setCursorVariant("default");
  
  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      // Add any images you want to preload here
    };
    
    preloadImages();
  }, []);

  return (
    <div className="App">
      <Cursor cursorVariant={cursorVariant} />
      
      <Header 
        textEnter={textEnter} 
        buttonEnter={buttonEnter} 
        defaultCursor={defaultCursor} 
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero 
              textEnter={textEnter} 
              buttonEnter={buttonEnter} 
              defaultCursor={defaultCursor} 
            />
            
            <About 
              textEnter={textEnter} 
              buttonEnter={buttonEnter} 
              defaultCursor={defaultCursor} 
            />
            
            <Innovations 
              textEnter={textEnter} 
              buttonEnter={buttonEnter} 
              defaultCursor={defaultCursor} 
            />
            
            <Projects 
              textEnter={textEnter} 
              buttonEnter={buttonEnter} 
              defaultCursor={defaultCursor} 
            />
            
            <Consultancy 
              textEnter={textEnter} 
              buttonEnter={buttonEnter} 
              defaultCursor={defaultCursor} 
            />
            
            <Contact 
              textEnter={textEnter} 
              buttonEnter={buttonEnter} 
              defaultCursor={defaultCursor} 
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
