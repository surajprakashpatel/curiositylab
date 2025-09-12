import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from '../components/Header';
import '../styles/Career.css';
import CountUp from '../components/Countup';

import trainingIcon from "../assets/icons/training.svg";
import internshipIcon from "../assets/icons/internship.svg";
import paidIcon from "../assets/icons/paid.png";
import skillsIcon from "../assets/icons/skill.svg";
import projectIcon from "../assets/icons/project.svg";
import mentorIcon from "../assets/icons/mentor.svg";
import certIcon from "../assets/icons/certificate.svg";
import teamIcon from "../assets/icons/team.svg";
import growthIcon from "../assets/icons/growth.svg";

const Career = () => {
  useEffect(() => {
    document.body.classList.add('career-page');
    return () => {
      document.body.classList.remove('career-page');
    };
  }, []);

  const navigate = useNavigate();
  
  const [activeProgram, setActiveProgram] = useState(null);

  const handleApplyClick = (programType) => {
    // Handle application logic here
    console.log(`Apply for ${programType} clicked`);
  };

  const handleLearnMore = (programType) => {
    setActiveProgram(activeProgram === programType ? null : programType);
  };

  return (
    <>
      <section>
        <div className="career-container">
          <Header />
          
          {/* Hero Section */}
          <div className="career-hero-content">
            <div className="career-hero-text">
              <p className="career-section-label">START YOUR JOURNEY</p>
              <h1 className="career-hero-title">
                Shape Your Future with Us
              </h1>
              <p className="career-hero-subtitle">
                Join Curiosity Lab and accelerate your career in technology. Whether you're looking to learn, 
                grow, or make an impact, we have the perfect program to launch your journey in software development.
              </p>
            </div>
            
            {/* Career Stats */}
            <div className="career-stats-grid">
              <div className="career-stat-card">
                <div className="career-stat-number"><CountUp
                                from={0}
                                to={500}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text"
                                />+</div>
                <div className="career-stat-label">Students Trained</div>
              </div>
              <div className="career-stat-card">
                <div className="career-stat-number">95%</div>
                <div className="career-stat-label">Placement Rate</div>
              </div>
              <div className="career-stat-card">
                <div className="career-stat-number"><CountUp
                                from={0}
                                to={10}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text"
                                />+</div>
                <div className="career-stat-label">Partner Companies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section>
        <div className="career-programs-container">
          <div className="career-programs-content">
            <div className="career-programs-header">
              <h2 className="career-programs-title">Choose Your Path</h2>
              <p className="career-programs-description">
                Three distinct programs designed to meet you wherever you are in your career journey
              </p>
            </div>

            <div className="career-programs-grid">
              {/* Vocational Training */}
              <div className="career-program-card career-training-card">
                <div className="career-program-header">
                  <div className="career-program-icon">
                    <img src={trainingIcon} alt="Training" />
                  </div>
                  <div className="career-program-badge career-paid-badge">PAID PROGRAM</div>
                </div>
                
                <h3 className="career-program-title">Vocational Training</h3>
                <p className="career-program-subtitle">Comprehensive skill development program</p>
                
                <div className="career-program-price">
                  <span className="career-price-currency">₹</span>
                  <span className="career-price-amount">3,000</span>
                  <span className="career-price-period">/1 month</span>
                </div>

                <div className="career-program-features">
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={skillsIcon} alt="Skills" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Industry-Ready Skills</h4>
                      <p>Learn cutting-edge technologies and frameworks</p>
                    </div>
                  </div>
                  
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={projectIcon} alt="Projects" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Real Projects</h4>
                      <p>Work on actual client projects and build portfolio</p>
                    </div>
                  </div>
                  
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={mentorIcon} alt="Mentor" />
                    </div>
                    <div className="career-feature-text">
                      <h4>1-on-1 Mentorship</h4>
                      <p>Personal guidance from industry experts</p>
                    </div>
                  </div>

                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={certIcon} alt="Certificate" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Industry Certificate</h4>
                      <p>Recognized certification upon completion</p>
                    </div>
                  </div>
                </div>

                <div className="career-program-actions">
                  <button 
                    className="career-apply-btn career-primary-btn"
                    onClick={() => handleApplyClick('training')}
                  >
                    Enroll Now
                    <span className="career-btn-arrow">→</span>
                  </button>
                  <button 
                    className="career-learn-more-btn"
                    onClick={() => handleLearnMore('training')}
                  >
                    Learn More
                  </button>
                </div>

                {activeProgram === 'training' && (
                  <div className="career-program-details">
                    <h4>Program Curriculum:</h4>
                    <ul>
                      <li>Full-Stack Web Development</li>
                      <li>React.js & Node.js Mastery</li>
                      <li>Database Design & Management</li>
                      <li>DevOps & Cloud Deployment</li>
                      <li>Agile Development Practices</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Free Internship */}
              <div className="career-program-card career-internship-card">
                <div className="career-program-header">
                  <div className="career-program-icon">
                    <img src={internshipIcon} alt="Internship" />
                  </div>
                  <div className="career-program-badge career-free-badge">FREE PROGRAM</div>
                </div>
                
                <h3 className="career-program-title">Free Internship</h3>
                <p className="career-program-subtitle">Hands-on experience with real projects</p>
                
                <div className="career-program-price">
                  <span className="career-price-amount">FREE</span>
                  <span className="career-price-period">/ month</span>
                </div>

                <div className="career-program-features">
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={teamIcon} alt="Team" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Team Collaboration</h4>
                      <p>Work alongside experienced developers</p>
                    </div>
                  </div>
                  
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={projectIcon} alt="Projects" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Live Projects</h4>
                      <p>Contribute to real client solutions</p>
                    </div>
                  </div>
                  
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={skillsIcon} alt="Skills" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Skill Development</h4>
                      <p>Learn while you work on actual projects</p>
                    </div>
                  </div>

                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={mentorIcon} alt="Mentor" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Flexible Schedule</h4>
                      <p>Part-time commitment that fits your schedule</p>
                    </div>
                  </div>
                </div>

                <div className="career-program-actions">
                  <button 
                    className="career-apply-btn career-secondary-btn"
                    onClick={() => handleApplyClick('internship')}
                  >
                    Apply Now
                    <span className="career-btn-arrow">→</span>
                  </button>
                  <button 
                    className="career-learn-more-btn"
                    onClick={() => handleLearnMore('internship')}
                  >
                    Learn More
                  </button>
                </div>

                {activeProgram === 'internship' && (
                  <div className="career-program-details">
                    <h4>What You'll Do:</h4>
                    <ul>
                      <li>Frontend Development Tasks</li>
                      <li>API Integration Projects</li>
                      <li>Testing & Quality Assurance</li>
                      <li>Documentation & Code Review</li>
                      <li>Client Communication</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Paid Internship */}
              <div className="career-program-card career-paid-internship-card">
                <div className="career-program-header">
                  <div className="career-program-icon">
                    <img src={paidIcon} alt="Paid Internship" />
                  </div>
                  <div className="career-program-badge career-premium-badge">GET PAID</div>
                </div>
                
                <h3 className="career-program-title">Paid Internship</h3>
                <p className="career-program-subtitle">Earn while you learn with placement opportunities</p>
                
                <div className="career-program-price">
                  <span className="career-price-currency">₹</span>
                  <span className="career-price-amount">8,000</span>
                  <span className="career-price-period">/month</span>
                </div>

                <div className="career-program-features">
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={growthIcon} alt="Growth" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Career Growth</h4>
                      <p>Direct path to full-time employment</p>
                    </div>
                  </div>
                  
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={projectIcon} alt="Projects" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Advanced Projects</h4>
                      <p>Lead complex client projects and initiatives</p>
                    </div>
                  </div>
                  
                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={mentorIcon} alt="Mentor" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Senior Mentorship</h4>
                      <p>Direct mentoring from senior developers</p>
                    </div>
                  </div>

                  <div className="career-feature-item">
                    <div className="career-feature-icon">
                      <img src={teamIcon} alt="Team" />
                    </div>
                    <div className="career-feature-text">
                      <h4>Placement Support</h4>
                      <p>95% placement rate with partner companies</p>
                    </div>
                  </div>
                </div>

                <div className="career-program-actions">
                  <button 
                    className="career-apply-btn career-premium-btn"
                    onClick={() => handleApplyClick('paid-internship')}
                  >
                    Apply Now
                    <span className="career-btn-arrow">→</span>
                  </button>
                  <button 
                    className="career-learn-more-btn"
                    onClick={() => handleLearnMore('paid-internship')}
                  >
                    Learn More
                  </button>
                </div>

                {activeProgram === 'paid-internship' && (
                  <div className="career-program-details">
                    <h4>Responsibilities:</h4>
                    <ul>
                      <li>Full-Stack Development</li>
                      <li>Project Leadership</li>
                      <li>Client Interaction</li>
                      <li>Code Architecture</li>
                      <li>Team Mentoring</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}

      <section>
  <div className="career-learning-container">
    <div className="career-learning-content">
      <div className="career-learning-header">
        <p className="career-learning-label">CURRICULUM OVERVIEW</p>
        <h2 className="career-learning-title">What You'll Master</h2>
        <p className="career-learning-description">
          Comprehensive curriculum designed to make you industry-ready with cutting-edge technologies
        </p>
      </div>

      <div className="career-learning-grid">
        {/* Web Development */}
        <div className="career-learning-card career-webdev-card">
          <div className="career-learning-card-header">
            <div className="career-learning-icon career-webdev-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11.37C15.69 11.74 15.27 12 14.77 12.27C14.32 12.53 13.83 12.67 13.33 12.67C12.85 12.67 12.38 12.53 11.94 12.27C11.46 12 11.04 11.74 10.73 11.37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="career-learning-badge career-webdev-badge">FRONTEND & BACKEND</div>
          </div>
          
          <h3 className="career-learning-card-title">Web Development</h3>
          <p className="career-learning-card-subtitle">
            Master full-stack development with modern frameworks and tools
          </p>
          
          <div className="career-learning-topics">
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>HTML,CSS & JavaScript</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>React.js & Node.js</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Tailwind & Typecsript</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Database Design</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>REST APIs & GraphQL</span>
            </div>
          </div>
          
          <div className="career-learning-card-footer">
            <div className="career-learning-duration">
              <span className="career-learning-duration-icon">⏱</span>
              <span>40 classes</span>
            </div>
            <div className="career-learning-projects">
              <span className="career-learning-projects-icon">📁</span>
              <span>5+ Projects</span>
            </div>
          </div>
        </div>

        {/* Python Programming */}
        <div className="career-learning-card career-python-card">
          <div className="career-learning-card-header">
            <div className="career-learning-icon career-python-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19C6.79086 19 5 17.2091 5 15V9C5 6.79086 6.79086 5 9 5H15C17.2091 5 19 6.79086 19 9V15C19 17.2091 17.2091 19 15 19H9Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div className="career-learning-badge career-python-badge">AUTOMATION & SCRIPTING</div>
          </div>
          
          <h3 className="career-learning-card-title">Python Programming</h3>
          <p className="career-learning-card-subtitle">
            Learn Python for automation, web scraping, and backend development
          </p>
          
          <div className="career-learning-topics">
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Python Fundamentals</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Object Oriented Programming</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Making UI softwares with PyQT</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>API Development</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Flask, Django and more</span>
            </div>
          </div>
          
          <div className="career-learning-card-footer">
            <div className="career-learning-duration">
              <span className="career-learning-duration-icon">⏱</span>
              <span>40 classes</span>
            </div>
            <div className="career-learning-projects">
              <span className="career-learning-projects-icon">📁</span>
              <span>4+ Projects</span>
            </div>
          </div>
        </div>

        {/* Artificial Intelligence */}
        <div className="career-learning-card career-ai-card">
          <div className="career-learning-card-header">
            <div className="career-learning-icon career-ai-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="career-learning-badge career-ai-badge">FUTURE TECHNOLOGY</div>
          </div>
          
          <h3 className="career-learning-card-title">Artificial Intelligence</h3>
          <p className="career-learning-card-subtitle">
            Explore AI fundamentals and build intelligent applications
          </p>
          
          <div className="career-learning-topics">
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>AI Fundamentals</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Neural Networks</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Natural Language Processing</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Computer Vision</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>OpenAI Integration</span>
            </div>
          </div>
          
          <div className="career-learning-card-footer">
            <div className="career-learning-duration">
              <span className="career-learning-duration-icon">⏱</span>
              <span>40 classes</span>
            </div>
            <div className="career-learning-projects">
              <span className="career-learning-projects-icon">📁</span>
              <span>3+ Projects</span>
            </div>
          </div>
        </div>

        {/* Machine Learning */}
        <div className="career-learning-card career-ml-card">
          <div className="career-learning-card-header">
            <div className="career-learning-icon career-ml-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L12 6L16 10L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="21" cy="5" r="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="career-learning-badge career-ml-badge">DATA SCIENCE</div>
          </div>
          
          <h3 className="career-learning-card-title">Machine Learning</h3>
          <p className="career-learning-card-subtitle">
            Build predictive models and data-driven solutions
          </p>
          
          <div className="career-learning-topics">
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Data Analysis & Pandas</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Scikit-learn & TensorFlow</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Predictive Modeling</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Data Visualization</span>
            </div>
            <div className="career-learning-topic-item">
              <div className="career-learning-topic-dot"></div>
              <span>Model Deployment</span>
            </div>
          </div>
          
          <div className="career-learning-card-footer">
            <div className="career-learning-duration">
              <span className="career-learning-duration-icon">⏱</span>
              <span>40 classes</span>
            </div>
            <div className="career-learning-projects">
              <span className="career-learning-projects-icon">📁</span>
              <span>4+ Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="career-learning-path">
        <h3 className="career-learning-path-title">Your Learning Journey</h3>
        <div className="career-learning-steps">
          <div className="career-learning-step">
            <div className="career-learning-step-number">1</div>
            <div className="career-learning-step-content">
              <h4>Foundation</h4>
              <p>Master the basics and build strong fundamentals</p>
            </div>
          </div>
          <div className="career-learning-step-connector"></div>
          <div className="career-learning-step">
            <div className="career-learning-step-number">2</div>
            <div className="career-learning-step-content">
              <h4>Specialization</h4>
              <p>Choose your path and dive deep into advanced topics</p>
            </div>
          </div>
          <div className="career-learning-step-connector"></div>
          <div className="career-learning-step">
            <div className="career-learning-step-number">3</div>
            <div className="career-learning-step-content">
              <h4>Application</h4>
              <p>Build real-world projects and create your portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      <section>
        <div className="career-cta-container">
          <div className="career-cta-content">
            <h2 className="career-cta-title">Ready to Start Your Journey?</h2>
            <p className="career-cta-description">
              Join hundreds of students who have transformed their careers with Curiosity Lab. 
              Take the first step towards becoming a skilled software developer.
            </p>
            <div className="career-cta-actions">
              <button className="career-cta-primary-btn">
                Contact Us
                <span className="career-btn-arrow">→</span>
              </button>
              <button className="career-cta-secondary-btn">
                Download Brochure
                <span className="career-btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Career;