import React,{useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer";
import '../styles/NewHome.css';
import insta from "../assets/icons/instagram.png";
import youtube from "../assets/icons/youtube.png";
import x from "../assets/icons/x.png";
import linkedin from "../assets/icons/linkedin.png";
import {Link , ELement} from "react-scroll" ;
import commitment from "../assets/icons/commitment.png";
import collab from "../assets/icons/collab.png";
import innovation from "../assets/icons/innovation.png";
import future from "../assets/icons/future.png";
import globe from "../assets/icons/globe.png";
import community from "../assets/icons/community.png";
import email from "../assets/icons/email.png";
import phone from "../assets/icons/phone.png"
import location from "../assets/icons/location.png";
import logo from "../assets/icons/logo.png";
import CountUp from '../components/Countup';
import Header from '../components/Header'



const Home = () => {
    useEffect(() => {
    document.body.classList.add('home-page');
    return () => {
    document.body.classList.remove('home-page');
      };
    }, []);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (<><section>
    <div className="hero-container">
      {/* Navigation */}
      <Header/>

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Building the Future, One Product at a Time
        </h1>
        <p className="hero-subtitle">
          We craft cutting-edge digital products that empower businesses to scale, adapt, and lead in a fast-changing world. From idea to launch, we turn possibilities into powerful solutions.
        </p>
        
        <div className="hero-actions">
          <button className="primary-btn">
            See Our Products
            <span className="btn-arrow">→</span>
          </button>
          <button className="secondary-btn">
            Explore Curiosity Lab
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Verification Flow Diagram */}
        <div className="verification-flow">
          <div className="consumer-section">
            <div className="consumer-avatar">
              <div className="avatar-placeholder">👤</div>
              <span className="consumer-label">Consumer</span>
            </div>
          </div>

          <div className="data-flow">
            <div className="flow-line"></div>
            
            <div className="verification-cards">
              <div className="verification-card employment-card">
                <div className="card-icon">💼</div>
                <span className="card-label"></span>
              </div>
              
              <div className="verification-card income-card">
                <div className="card-icon">🔒</div>
                <span className="card-label"></span>
              </div>
              
              <div className="verification-card docs-card">
                <div className="card-icon">📄</div>
                <span className="card-label"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="bg-decoration-left"></div>
      <div className="bg-decoration-right"></div>
    </div>
    </section>
    <section>
        <div className="about-container">
      <div className="about-content">
        {/* Header Section */}
        <element name="about">
        <div className="about-header">
          <p className="section-label">OUR MISSION</p>
          <h1 className="about-title">About Us</h1>
          <p className="about-description">
            We are a passionate team of innovators, creators, and problem-solvers 
            dedicated to building technology that makes the world a better place. Our journey is one of 
            relentless curiosity and a commitment to developing software solutions that create positive impact.
          </p>
        </div>

        {/* Values Cards */}
        <div className="values-grid">
          <div className="value-card innovation-card">
            <div className="value-icon">
              <div className="icon-placeholder innovation-icon"><img src={innovation}/></div>
            </div>
            <h3 className="value-title">Innovation at Heart</h3>
            <p className="value-description">
              We thrive on challenges and believe in the 
              power of innovative thinking to create 
              software solutions that are not just effective, but 
              also transformative and user-centric.
            </p>
          </div>

          <div className="value-card collaboration-card">
            <div className="value-icon">
              <div className="icon-placeholder collaboration-icon"><img src={collab}/></div>
            </div>
            <h3 className="value-title">Collaborative Spirit</h3>
            <p className="value-description">
              Our strength lies in our collaborative 
              approach. We work closely with our 
              clients and communities, fostering a culture of 
              open communication and shared vision for impact.
            </p>
          </div>

          <div className="value-card quality-card">
            <div className="value-icon">
              <div className="icon-placeholder quality-icon"><img src={commitment}/></div>
            </div>
            <h3 className="value-title">Commitment to Excellence</h3>
            <p className="value-description">
              We are meticulous about quality. From the 
              initial concept to the final product, we 
              maintain the highest standards to deliver 
              reliable and impactful software solutions.
            </p>
          </div>
        </div>
        </element>

        {/* Call to Action */}
        <div className="about-cta">
          <button className="meet-team-btn">
            Meet the Team
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="bg-decoration-top"></div>
      <div className="bg-decoration-bottom"></div>
    </div>
    </section>
    <element name="goal">
    <section>
        <div className="goal-container">
      <div className="goal-content">
        {/* Header Section */}
        <div className="goal-header">
          <p className="section-label">OUR VISION</p>
          <h1 className="goal-title">Our Goal</h1>
          <p className="goal-description">
            At Curiosity Lab, we envision a future where technology serves humanity's greatest challenges. 
            Our goal is to create software solutions that don't just solve problems, but inspire positive 
            change and empower communities worldwide.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="goals-grid">
          <div className="goal-card primary-goal">
            <div className="goal-number">01</div>
            <div className="goal-icon">
              <div className="icon-placeholder impact-icon"><img src={globe}/></div>
            </div>
            <h3 className="goal-title-card">Global Impact</h3>
            <p className="goal-description-card">
              Build scalable software solutions that address global challenges, 
              from climate change to social inequality, reaching millions of users 
              and creating measurable positive outcomes.
            </p>
          </div>

          <div className="goal-card secondary-goal">
            <div className="goal-number">02</div>
            <div className="goal-icon">
              <div className="icon-placeholder innovation-icon"><img src={innovation}/></div>
            </div>
            <h3 className="goal-title-card">Innovation Leadership</h3>
            <p className="goal-description-card">
              Pioneer cutting-edge technologies and development practices 
              that set new industry standards while maintaining our commitment 
              to ethical and sustainable software development.
            </p>
          </div>

          <div className="goal-card tertiary-goal">
            <div className="goal-number">03</div>
            <div className="goal-icon">
              <div className="icon-placeholder community-icon"><img src={community}/></div>
            </div>
            <h3 className="goal-title-card">Community Empowerment</h3>
            <p className="goal-description-card">
              Create open-source tools and educational resources that empower 
              developers and communities worldwide to build their own solutions 
              for local and global challenges.
            </p>
          </div>

          <div className="goal-card quaternary-goal">
            <div className="goal-number">04</div>
            <div className="goal-icon">
              <div className="icon-placeholder future-icon"><img src={future}/></div>
            </div>
            <h3 className="goal-title-card">Future-Ready Solutions</h3>
            <p className="goal-description-card">
              Develop adaptive and intelligent software that evolves with 
              changing needs, ensuring our solutions remain relevant and 
              effective for generations to come.
            </p>
          </div>
        </div>
        

        {/* Mission Statement */}
        <div className="mission-statement">
          <div className="mission-content">
            <h2 className="mission-title">Making Technology Meaningful</h2>
            <p className="mission-text">
              Every line of code we write, every feature we design, and every solution we deploy 
              is guided by one principle: technology should make the world better. We measure our 
              success not just in downloads or revenue, but in the positive impact we create.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <div className="stat-number"><CountUp
                from={0}
                to={10000}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
                />+</div>
                <div className="stat-label">Lives Impacted</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><CountUp
                from={0}
                to={5}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
                />+</div>
                <div className="stat-label">Countries Reached</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><CountUp
                from={0}
                to={3}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
                />+</div>
                <div className="stat-label">Of Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="goal-cta">
          <button className="join-mission-btn">
            Join Our Mission
            <span className="btn-arrow">→</span>
          </button>
          <button className="learn-more-btn">
            Learn More
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="bg-decoration-left"></div>
      <div className="bg-decoration-right"></div>
      <div className="bg-decoration-center"></div>
    </div>
    </section>
    </element>
    <element name="contact">
    <section>
        <div className="contact-container">
      <div className="contact-content">
        {/* Header Section */}
        <div className="contact-header">
          <p className="section-label">GET IN TOUCH</p>
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-description">
            Ready to make a difference with technology? We'd love to hear from you. 
            Whether you have a project in mind, want to collaborate, or just want to chat 
            about building a better world through code, let's connect.
          </p>
        </div>

        {/* Main Contact Section */}
        <div className="contact-main">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h2 className="form-title">Send us a message</h2>
              <p className="form-subtitle">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company" className="form-label">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your company name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="partnership">Partnership</option>
                    <option value="project">Project Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  placeholder="Tell us about your project or how we can help..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3 className="info-title">Let's start a conversation</h3>
              <p className="info-subtitle">
                We're always excited to discuss new ideas and opportunities to create positive impact through technology.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <div className="icon-placeholder email-icon"><img src={email}/></div>
                  </div>
                  <div className="method-info">
                    <h4 className="method-title">Email Us</h4>
                    <p className="method-text">contact@curiositylab.in</p>
                    <p className="method-subtext">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <div className="icon-placeholder phone-icon"><img src={phone}/></div>
                  </div>
                  <div className="method-info">
                    <h4 className="method-title">Call Us</h4>
                    <p className="method-text">+91 8815057965<br/>+91 9201703911</p>
                    <p className="method-subtext">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <div className="icon-placeholder location-icon"><img src={location}/></div>
                  </div>
                  <div className="method-info">
                    <h4 className="method-title">Visit Us</h4>
                    <p className="method-text">Building No.23 , Nehru Nagar<br />Smriti Nagar, Bhilai 491001</p>
                    <p className="method-subtext">Open for scheduled meetings</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h4 className="social-title">Follow our Journey</h4>
                <div className="social-icons">
                  <div className="social-icon"><img src={insta} /></div>
                  <div className="social-icon"><img src={youtube} /></div>
                  <div className="social-icon"><img src={x} /></div>
                  <div className="social-icon"><img src={linkedin} /></div>
                </div>
              </div>
            </div>

            <div className="response-time-card">
              <div className="response-icon">⚡</div>
              <h4 className="response-title">Quick Response</h4>
              <p className="response-text">
                We typically respond to all inquiries within 24 hours. For urgent matters, 
                please call us directly.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        
      </div>

      {/* Background decorative elements */}
      <div className="bg-decoration-top-left"></div>
      <div className="bg-decoration-bottom-right"></div>
      <div className="bg-decoration-center"></div>
    </div>
    </section>
    </element>
    <Footer/>
    </>
    
  );
};

export default Home;