import React from "react";
import {Link , ELement} from "react-scroll" ;
import {useNavigate} from "react-router-dom";
import "../styles/Header.css"
const Header = () => {
      const navigate = useNavigate();      
      return(<div classname="hero-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="header-logo">
            Curiosity Lab
          </div>
          <div className="nav-links">
            <div className="nav-item dropdown">
              Projects
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="nav-item dropdown">
              Services
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="nav-item dropdown">
              Resources
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="nav-item dropdown" onClick={()=>navigate("/careers")}>
              Careers
            </div>
            <div className="nav-item dropdown" onClick={()=>navigate("/kartavya")}>
              Kartavya
            </div>
            <Link to="about" smooth={true} duration={500}>
            <div className="nav-item">About Us</div>
            </Link>
            <Link to="goal" smooth={true} duration={500}>
            <div className="nav-item">Our Goal</div>
          </Link>
          </div>
          <div className="nav-actions">
            <Link to="contact" smooth={true} duration={500}><button className="sign-in-btn">Contact us</button></Link>
            <button className="contact-sales-btn" onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </div>
      </nav>
      </div>)
}

export default Header;