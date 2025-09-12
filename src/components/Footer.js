import React from 'react';
import '../styles/Footer.css';
import insta from "../assets/icons/instagram.png";
import linkedin from "../assets/icons/linkedin.png";
import x from "../assets/icons/x.png";
import youtube from "../assets/icons/youtube.png";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <h3 className="footer-logo">Curiosity Lab</h3>
            <p className="footer-description">
              Exploring innovation through curiosity and cutting-edge technology solutions.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <img src={insta}/>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <img src={linkedin}/>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <img src={x}/>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <img src={youtube}/>
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Attendence System</a></li>
              <li><a href="#" className="footer-link">Mobile Apps</a></li>
              <li><a href="#" className="footer-link">AI Solutions</a></li>
              <li><a href="#" className="footer-link">Consulting</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="footer-section">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Blogs</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Info</h4>
            <div className="contact-info">
              <p className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>contact@curiositylab.in</span>
              </p>
              <p className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+91 8815057965</span>
              </p>
              <p className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Building No. 23 , Smriti Nagar , Bhilai<br/> 491001 ,Chhattisgarh, India</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 Curiosity Lab. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;