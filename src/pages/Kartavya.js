import React,{useState} from 'react';
import '../styles/Kartavya.css';
import girl from '../assets/images/girl.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Kartavya = () => {
    const [expandedSections, setExpandedSections] = useState({});

  const toggleReadMore = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const uspData = [
    {
      id: 'flexible-shifts',
      title: 'Flexible Shifts',
      description: 'Overnight shifts? Whole-day working? Multiple shifts in a day? Or just the usual 9 to 5 – our shift module has you covered.',
      image: 'https://petpoojaweb.gumlet.io/images/payroll/Flexible-Shifts-new.svg',
      imageAlt: 'Flexible Shifts',
      features: [
        'Multiple shift creation & assignment',
        '24-hour & overnight shifts timings',
        'Alternate week-off assignment'
      ],
      imagePosition: 'right'
    },
    {
      id: 'loans-advances',
      title: 'Loans & Advances',
      description: "Can't track how much amount was given to which employee on which date? Well, now you can note down everything & adjust it against salary automatically.",
      image: 'https://petpoojaweb.gumlet.io/images/payroll/Loans-Advances-new.svg',
      imageAlt: 'Loans & Advances',
      features: [
        'Easily note loans/advance payment transactions against employees',
        'Auto-deduct advance payments from salary',
        'Easy access to debit/credit transaction logs of employees'
      ],
      imagePosition: 'left'
    },
    {
      id: 'customisable-reports',
      title: 'Customisable reports',
      description: 'Avail reports as per your required format & get detailed insights about your staff operations & activities.',
      image: 'https://petpoojaweb.gumlet.io/images/payroll/Customisable-reports-new.svg',
      imageAlt: 'Customisable reports',
      features: [
        'Easily download reports in excel or export to google sheets',
        '6+ industry-standard reports & unlimited customisable reports as per requirement',
        'Get employee, department, designation & overall organization-wise reports for better decision-making'
      ],
      imagePosition: 'right'
    }
  ];
  return (<>
  <Header/>
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
    <section className="usps-wrapper">
      <div className="container">
        <div className="header-section">
          <span className="section-badge">Our USPs</span>
          <h2 className="section-title">
            Easy, detailed &<br />accurate operations
          </h2>
          <p className="section-subtitle">
            We have built functionalities that makes complex payroll
            <br className="hidden-mobile" />
            processes extra smooth for you
          </p>
        </div>

        <div className="usps-content">
          {uspData.map((usp, index) => (
            <div 
              key={usp.id} 
              className={`usp-item ${usp.imagePosition === 'left' ? 'reverse' : ''} ${index === uspData.length - 1 ? 'last' : ''}`}
            >
              <div className="usp-text">
                <h3 className="usp-title">{usp.title}</h3>
                <p className="usp-description">{usp.description}</p>
                
                <ul className={`feature-list ${expandedSections[usp.id] ? 'expanded' : ''}`}>
                  {usp.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="feature-item">
                      <img 
                        src="https://petpoojaweb.gumlet.io/images/purchase-new/grey-circle.svg" 
                        alt="Bullet point" 
                        className="bullet-point"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="read-more-btn"
                  onClick={() => toggleReadMore(usp.id)}
                >
                  {expandedSections[usp.id] ? 'Read Less' : 'Read More'}
                </button>
              </div>

              <div className="usp-image">
                <img 
                  src={usp.image} 
                  alt={usp.imageAlt}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default Kartavya;