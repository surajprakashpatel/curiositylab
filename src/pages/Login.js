import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import googleIcon from '../assets/google-icon.svg';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const LoginPage = () => {
  useEffect(() => {
  document.body.classList.add('login-page');
  return () => {
    document.body.classList.remove('login-page');
  };
}, []);
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword, fetchUserProfile, logout } = useAuth();
  
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
      
      const userCredential = await login(formData.email, formData.password);
      const userId = userCredential.user.uid;
      
      // Fetch user profile to check account type and status
      const userProfile = await fetchUserProfile(userId);
      
      if (!userProfile) {
        setError('User profile not found. Please contact support.');
        await logout();
        return;
      }
      
      // Check account status
      if (userProfile.accountStatus === 'pending') {
        setError('Your account is pending approval from an administrator. Please try again later.');
        await logout();
        return;
      }
      
      if (userProfile.accountStatus === 'inactive' || userProfile.accountStatus === 'rejected') {
        setError('Your account has been deactivated or rejected. Please contact support for assistance.');
        await logout();
        return;
      }
      
      // Redirect based on account type for active accounts
      if (userProfile.accountType === 'admin') {
        navigate('/admin');
      } else if (userProfile.accountType === 'client') {
        navigate('/client');
      } else {
        navigate('/dashboard');
      }
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
      
      const result = await loginWithGoogle();
      const userId = result.user.uid;
      
      // Fetch user profile to check account type and status
      const userProfile = await fetchUserProfile(userId);
      
      if (!userProfile) {
        setError('User profile not found. Please contact support.');
        await logout();
        return;
      }
      
      // Check account status
      if (userProfile.accountStatus === 'pending') {
        setError('Your account is pending approval from an administrator. Please try again later.');
        await logout();
        return;
      }
      
      if (userProfile.accountStatus === 'inactive' || userProfile.accountStatus === 'rejected') {
        setError('Your account has been deactivated or rejected. Please contact support for assistance.');
        await logout();
        return;
      }
      
      // Redirect based on account type for active accounts
      if (userProfile.accountType === 'admin') {
        navigate('/admin');
      } else if (userProfile.accountType === 'client') {
        navigate('/client');
      } else {
        navigate('/dashboard');
      }
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

  return (<>
    <Header/>
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
                Forgot Password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          <button 
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img src={googleIcon} alt="Google" className="google-icon" />
            Sign in with Google
          </button>
        </div>
      </div>
      
      <div className="left-panel">
  {/* Floating geometric decorations */}
  <div className="geometric-decoration shape-circle-1"></div>
  <div className="geometric-decoration shape-square-1"></div>
  <div className="geometric-decoration shape-circle-2"></div>
  <div className="geometric-decoration shape-square-2"></div>
  
  <div className="left-panel-content">
    <h1>Welcome to Curiosity Lab</h1>
    <p>Your all-in-one ERP solution for project management</p>
  </div>
</div>
    </div>
  </>);
};

export default LoginPage;
