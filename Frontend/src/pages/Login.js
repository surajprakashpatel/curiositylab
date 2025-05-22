import React, { useState } from 'react';
import '../styles/login.css';
import googleIcon from '../assets/google-icon.svg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    // Add your login logic here
  };

  return (
    <div className="login-container">
      <div className="right-panel">
        <div className="login-form-container">
          <h2>Log in to <span className="highlight">Curiosity Lab</span></h2>
          
          <div className="signup-link">
            New to Curiosity Lab?
            <a href="/signup"> Create an account</a>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email Address"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your Password"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? 
                    <span className="eye-icon">👁️</span> : 
                    <span className="eye-icon">👁️‍🗨️</span>
                  }
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              
              <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" className="login-btn">Log In</button>
            
            <div className="divider">
              <span>Or</span>
            </div>
            
            <button type="button" className="google-signin-btn">
              <img src={googleIcon} alt="Google" className="google-icon" />
              Log in with Google
            </button>
          </form>
        </div>
      </div>

      <div className="left-panel">
        <div className="left-content">
          <h1>Welcome Back to<br />Curiosity Lab</h1>
          <p>Log in to your account to access your dashboard, projects, and continue your journey with <span className="highlight">Curiosity Lab</span>.</p>
          <div className="rating">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <p className="testimonial">"The insights from <span className="highlight">Curiosity Lab</span> have transformed how we approach our business strategy and decision-making."</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;