import React, { useState, useEffect } from 'react';
import '../styles/Home.css';

function Home() {
  // Navbar state
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle contact form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="navbar-logo">
            <a href="#home">Curiosity Lab</a>
          </div>
          <div className="navbar-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About Us</a></li>
            <li><a href="#goal" onClick={() => setMenuOpen(false)}>Our Goal</a></li>
            <li><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
            <li><a href="/login" className="erp-button" onClick={() => setMenuOpen(false)}>ERP Login</a></li>
          </ul>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="container hero-container">
            <div className="hero-content">
              <h1>Innovating for a <span className="highlight">Better Tomorrow</span></h1>
              <p className="hero-subtitle">
                We're a team of passionate engineers dedicated to solving complex problems 
                and creating impactful technology solutions.
              </p>
              <div className="hero-buttons">
                <a href="#services" className="btn">Our Services</a>
                <a href="#contact" className="btn btn-outline">Get in Touch</a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <h2 className="section-title">About Us</h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  Curiosity Lab is a technology innovation hub founded by a team of engineers with a shared passion for building exceptional software solutions. We combine cutting-edge technology with creative problem-solving to deliver impactful results.
                </p>
                <p>
                  Our team brings diverse expertise across software development, systems architecture, artificial intelligence, and more. We're united by our commitment to quality, innovation, and making a positive impact through technology.
                </p>
              </div>
              <div className="about-values">
                <div className="value-item">
                  <h3>Innovation</h3>
                  <p>We constantly push boundaries and explore new technologies to create innovative solutions.</p>
                </div>
                <div className="value-item">
                  <h3>Excellence</h3>
                  <p>We're committed to delivering excellence in every project we undertake.</p>
                </div>
                <div className="value-item">
                  <h3>Collaboration</h3>
                  <p>We believe in the power of collaboration and work closely with our clients and partners.</p>
                </div>
                <div className="value-item">
                  <h3>Impact</h3>
                  <p>We measure our success by the positive impact our solutions create.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Goal Section */}
        <section id="goal" className="goal-section">
          <div className="container">
            <h2 className="section-title">Our Goal</h2>
            <div className="goal-content">
              <div className="goal-text">
                <p>
                  At Curiosity Lab, our mission is to harness technology to solve complex challenges and create a positive impact. We aim to become a leading technology partner known for innovation, quality, and excellence in everything we do.
                </p>
                <p>
                  We're driven by a desire to push technological boundaries while maintaining a strong focus on creating practical, impactful solutions that address real-world problems.
                </p>
              </div>
              <div className="goal-objectives">
                <div className="objective-item">
                  <h3>10+</h3>
                  <p>Innovative projects completed</p>
                </div>
                <div className="objective-item">
                  <h3>15+</h3>
                  <p>Skilled engineers and researchers</p>
                </div>
                <div className="objective-item">
                  <h3>5+</h3>
                  <p>Industry partnerships</p>
                </div>
                <div className="objective-item">
                  <h3>3+</h3>
                  <p>Research publications</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects-section">
          <div className="container">
            <h2 className="section-title">Our Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-content">
                  <h3>Autonomous Drone Control System</h3>
                  <p>
                    An advanced control system for autonomous drones using computer vision and machine learning for navigation and obstacle avoidance.
                  </p>
                  <div className="project-status">
                    <div className="status-indicator in-progress"></div>
                    <span className="status-text">In Progress</span>
                  </div>
                </div>
              </div>
              <div className="project-card">
                <div className="project-content">
                  <h3>Smart Agriculture Monitoring</h3>
                  <p>
                    IoT-based system that monitors soil conditions, weather, and crop health to optimize irrigation and resource usage in agriculture.
                  </p>
                  <div className="project-status">
                    <div className="status-indicator in-progress"></div>
                    <span className="status-text">In Progress</span>
                  </div>
                </div>
              </div>
              <div className="project-card">
                <div className="project-content">
                  <h3>Advanced AI Research Assistant</h3>
                  <p>
                    An AI-powered research assistant that helps researchers discover relevant papers, analyze data, and generate insights.
                  </p>
                  <div className="project-status">
                    <div className="status-indicator in-progress"></div>
                    <span className="status-text">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="container">
            <h2 className="section-title">Our Services</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3>Technical Strategy</h3>
                <p>
                  Strategic technology planning and roadmap development to align your tech initiatives with business goals.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3>Software Development</h3>
                <p>
                  Custom software development with a focus on quality, scalability, and maintainability.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>Security Assessment</h3>
                <p>
                  Comprehensive security audits and penetration testing to identify and address vulnerabilities.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3>Digital Transformation</h3>
                <p>
                  End-to-end digital transformation services to modernize your business processes and systems.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Team Augmentation</h3>
                <p>
                  Skilled engineers who integrate with your team to accelerate project delivery and add specialized expertise.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <h3>Technical Training</h3>
                <p>
                  Customized training programs to upskill your team in emerging technologies and best practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="container">
            <h2 className="section-title">Contact Us</h2>
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <h3>Email</h3>
                  <p>info@curiositylab.tech</p>
                </div>
                <div className="contact-item">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="contact-item">
                  <h3>Address</h3>
                  <p>
                    123 Innovation Drive<br />
                    Tech Valley, CA 94103<br />
                    United States
                  </p>
                </div>
                <div className="contact-item">
                  <h3>Working Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Consultancy Services">Consultancy Services</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Career Information">Career Information</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>Curiosity Lab</h2>
              <p>Innovating for a better tomorrow</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-links-column">
                <h3>Navigation</h3>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#goal">Our Goal</a></li>
                  <li><a href="#projects">Projects</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h3>Services</h3>
                <ul>
                  <li><a href="#services">Technical Strategy</a></li>
                  <li><a href="#services">Software Development</a></li>
                  <li><a href="#services">Security Assessment</a></li>
                  <li><a href="#services">Digital Transformation</a></li>
                  <li><a href="#services">Team Augmentation</a></li>
                  <li><a href="#services">Technical Training</a></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h3>Legal</h3>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {currentYear} Curiosity Lab. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 