import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import googleIcon from '../assets/google-icon.svg';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleResetPassword = async () => {
    try {
      setMessage('');
      setError('');
      
      if (!formData.email) {
        setError('Please enter your email address.');
        return;
      }
      
      await resetPassword(formData.email);
      setMessage('Check your email for password reset instructions.');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="right-panel">
        <div className="login-form-container">
          <h2>Log in to <span className="highlight">Curiosity Lab</span></h2>
          
          <div className="signup-link">
            New to Curiosity Lab?
            <Link to="/signup"> Create an account</Link>
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
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
              
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleResetPassword}
              >
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            
            <div className="divider">
              <span>Or</span>
            </div>
            
            <button 
              type="button" 
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
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