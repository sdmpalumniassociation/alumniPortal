import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/sdmp-logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
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
                name="email"
                value={formData.email}
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
    </div>
  );
};

export default Login;
