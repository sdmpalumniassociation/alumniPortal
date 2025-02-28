import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/sdmp-logo.png';
import usersData from '../assets/data/Users.json';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // for email/username/phone
    password: ''
  });
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateCredentials = () => {
    return usersData.find(user => 
      (user.email === formData.identifier || 
       user.username === formData.identifier || 
       user.phone === formData.identifier) && 
      user.password === formData.password
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = validateCredentials();
    
    if (user) {
      setShowDialog(true);
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    navigate('/user-homepage '); // Navigate to LandingPage after successful login
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img src={logo} alt="SDM Polytechnic Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email/Username/Phone Number</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="login-input"
                placeholder="Enter Email/Username/Phone Number"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="Enter Password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="login-links">
              <Link to="/register" className="create-account">
                New User? Create account here
              </Link>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password
              </Link>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>

      {showDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <p>Login successful!</p>
            <button onClick={handleDialogClose} className="dialog-button">Okay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
