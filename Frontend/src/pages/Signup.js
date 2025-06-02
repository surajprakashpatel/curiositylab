import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signup.css';
import googleIcon from '../assets/google-icon.svg';
import { useAuth } from '../contexts/AuthContext';
import { setDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0,
    mobile : 0,
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    progileImgLink: "",
    accountType: "Employee",
    address : "",
    accountStatus:"pending"
  });

  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // 1. Get the first name
      const firstName = formData.fullName.trim().split(' ')[0].toLowerCase();

      // 2. Check for existing usernames in Firestore
      let finalUsername = firstName;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", ">=", firstName), where("username", "<=", firstName + "\uf8ff"));
      const querySnapshot = await getDocs(q);

      // 3. Collect all usernames that start with the first name
      const existingUsernames = querySnapshot.docs.map(doc => doc.data().username);

      if (existingUsernames.includes(firstName)) {
        // Find the next available number
        let i = 1;
        while (existingUsernames.includes(firstName + (i < 10 ? '0' + i : i))) {
          i++;
        }
        finalUsername = firstName + (i < 10 ? '0' + i : i);
      }

      // Create user in Firebase Authentication
      const userCredential = await signup(formData.email, formData.password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: formData.fullName,
        name: formData.fullName,
        email: formData.email,
        mobile: formData.phoneNumber,
        createdAt: new Date().toISOString(),
        age: formData.age || 0,
        agreeToTerms: formData.agreeToTerms,
        profileImgLink: "",
        address: formData.address || "adress to be updated",
        accountType: formData.accountType || "user",
        accountStatus: "pending",
        username: finalUsername
      });
      
      // Show success message and redirect to login page
      setError('');
      alert('Your account has been created! It will be pending until an admin approves it. You will be redirected to the login page.');
      navigate('/login');
    } catch (err) {
      setError('Failed to create an account. ' + err.message);
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      
      const result = await loginWithGoogle();
      const userId = result.user.uid;
      
      // Update the user's account status to pending if it's a new account
      await setDoc(doc(db, "users", userId), {
        accountStatus: "pending"
      }, { merge: true });
      
      alert('Your account will be pending until an admin approves it.');
      navigate('/login');
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
      console.error(err);
    }
    
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="right-panel">
        <div className="signup-form-container">
          <h2>Sign up to <span className="highlight">Curiosity Lab</span></h2>
          
          <div className="login-link">
            Already a member?
            <Link to="/login"> Log in here</Link>
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          
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
                By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
              </label>
            </div>
            
            <button 
              type="submit" 
              className="create-account-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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