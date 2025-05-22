import React, { useState } from 'react';
import '../styles/signup.css';
import googleIcon from '../assets/google-icon.svg';



const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your signup logic here
  };

  return (
    <div className="signup-container">
      <div className="right-panel">
        <div className="signup-form-container">
          <h2>Sign up to <span className="highlight">Curiosity Lab</span></h2>
          
          <div className="login-link">
            Already a member?
            <a href="/login"> Log in here</a>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Your Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email Address</label>
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
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your Phone Number"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Create a Password</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible.password ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a Password"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {passwordVisible.password ? 
                    <span className="eye-icon">👁️</span> : 
                    <span className="eye-icon">👁️‍🗨️</span>
                  }
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Your Password</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Your Password"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {passwordVisible.confirmPassword ? 
                    <span className="eye-icon">👁️</span> : 
                    <span className="eye-icon">👁️‍🗨️</span>
                  }
                </button>
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreeToTerms">
                By signing up, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
              </label>
            </div>
            
            <button type="submit" className="create-account-btn">Create Account</button>
            
            <div className="divider">
              <span>Or</span>
            </div>
            
            <button type="button" className="google-signin-btn">
              <img src={googleIcon} alt="Google" className="google-icon" />
              Sign up with Google
            </button>
          </form>
        </div>
      </div>
      
      <div className="left-panel">
        <div className="left-content">
          <h1>Join Us and<br />Unlock Endless<br />Possibilities</h1>
          <p>Welcome to <span className="highlight">Curiosity Lab</span>, where your journey begins. Sign up now to access exclusive features, personalized recommendations, and seamless user experience.</p>
          <div className="rating">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <p className="testimonial">"We love <span className="highlight">Curiosity Lab</span>! Their team helped transform our digital presence with innovative solutions tailored to our needs."</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;