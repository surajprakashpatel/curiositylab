import React from 'react';
import '../styles/Kartavya.css';
import girl from '../assets/images/girl.svg'

const Kartavya = () => {
  return (<>
  <section>
      <div>
      <div className="kartavya-floating-elements">
        <div className="kartavya-floating-icon">📱</div>
        <div className="kartavya-floating-icon">⏰</div>
        <div className="kartavya-floating-icon">📊</div>
      </div>

      <section className="kartavya-hero-section">
        <div className="kartavya-hero-container">
          <div className="kartavya-hero-content">
            <h1 className="kartavya-hero-title">Kartavya</h1>
            <p className="kartavya-hero-subtitle">Smart Attendance Tracking Made Simple</p>
            <p className="kartavya-hero-description">
              Transform your attendance management with Kartavya's intuitive interface. 
              Track attendance, generate reports, and manage teams effortlessly with our 
              powerful yet simple mobile application.
            </p>
            <div className="kartavya-cta-buttons">
              <a href="#" className="kartavya-btn kartavya-btn-primary">
                📱 Download App
              </a>
              <a href="#" className="kartavya-btn kartavya-btn-secondary">
                🎥 Watch Demo
              </a>
            </div>
          </div>
          
          <div className="kartavya-hero-visual">
            <div className="kartavya-app-mockup">
              <div className="kartavya-mockup-screen">
                <div className="kartavya-mockup-header">Kartavya Dashboard</div>
                
                <div className="kartavya-dashboard-card">
                  <div className="kartavya-card-title">Today's Attendance</div>
                  <div className="kartavya-card-value">
                    <span className="kartavya-status-indicator"></span>
                    Present
                  </div>
                </div>
                
                <div className="kartavya-dashboard-card">
                  <div className="kartavya-card-title">This Week</div>
                  <div className="kartavya-card-value">5/5 Days</div>
                </div>
                
                <div className="kartavya-dashboard-card">
                  <div className="kartavya-card-title">Monthly Stats</div>
                  <div className="kartavya-card-value">95% Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
    <section className="attendance-hero">
      <div className="attendance-hero-container">
        <div className="attendance-hero-content">
          <div className="attendance-hero-text">
            <div className="attendance-brand-tag">
              EFFORTLESS OPERATIONS
            </div>
            
            <h1 className="attendance-hero-title">
              Attendance and Payroll Management 
              <span className="title-highlight"><br/>Simplified for All!</span>
            </h1>
            
            <p className="attendance-hero-subtitle">
              Effortless attendance tracking for owners with Owner App
            </p>
            

            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Staff onboarding & biometric registration is only possible from the app
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Helps you keep tabs on staff activity & operations at anytime, from anywhere
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Graphical representation of daily attendance & activities of multiple locations
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Easily track the status of your biometric device
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Hassle-free approvals of leave & attendance adjustments
                </div>
              </div>
            </div>
          </div>
          
          <div className="attendance-hero-image">
            <div className="floating-icons">
              <div className="floating-icon icon-1">👥</div>
              <div className="floating-icon icon-2">🔍</div>
              <div className="floating-icon icon-3">🤝</div>
              <div className="floating-icon icon-4">💼</div>
              <div className="floating-icon icon-5">👆</div>
            </div>
            <div className="main-illustration">
                <img src={girl} alt="Girl with smartphone" />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Kartavya;