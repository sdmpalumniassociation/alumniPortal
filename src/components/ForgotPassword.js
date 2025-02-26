import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/sdmp-logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img src={logo} alt="SDM Polytechnic Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="forgot-password-title">Forgot Password</h2>
            <p className="forgot-password-text">
              If your Email matches with our Records, you'll get a reset link to your mail
            </p>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter your email address"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Reset Password
            </button>
            <div className="back-to-login">
              <Link to="/login" className="create-account">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

