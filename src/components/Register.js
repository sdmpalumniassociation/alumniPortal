import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import logo from '../assets/images/sdmp-logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    countryCode: '+91',
    phone: '',
    whatsappSameAsPhone: false,
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    branch: ''
  });

  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked,
        whatsappNumber: checked ? prevState.phone : prevState.whatsappNumber
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        ...(name === 'phone' && prevState.whatsappSameAsPhone 
          ? { whatsappNumber: value } 
          : {})
      }));

      if (name === 'fullName') {
        generateUsernameSuggestions(value);
      }
    }
  };

  const generateUsernameSuggestions = (fullName) => {
    const baseName = fullName.toLowerCase().replace(/\s+/g, '');
    const suggestions = [
      baseName,
      `${baseName}${Math.floor(Math.random() * 100)}`,
      `${baseName}_${Math.floor(Math.random() * 100)}`,
      `${baseName}.${Math.floor(Math.random() * 100)}`,
      `${baseName}${new Date().getFullYear()}`
    ];
    setUsernameSuggestions(suggestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowDialog(true);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    navigate('/login');
  };

  const branches = [
    'Civil Engineering',
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering'
  ];

  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+971', country: 'UAE' },
    // Add more country codes as needed
  ];

  return (
    <div className="login-page">
      <div className="login-container register-container">
        {/* <div className="login-left">
          <img src={logo} alt="SDM Polytechnic Logo" className="login-logo" />
        </div> */}
        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="register-title">Register to SDM Polytechnic Alumni Association</h2>
            <p className="register-subtitle">Join the SDM Polytechnic Alumni Network</p>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="login-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="login-input"
                placeholder="Choose a username"
                required
              />
              <div className="username-suggestions">
                {usernameSuggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setFormData({ ...formData, username: suggestion })}
                    className="suggestion-button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="login-input"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group country-code">
                <label>Country Code</label>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="login-input"
                  required
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={code}>
                      {code} ({country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group phone-number">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="whatsappSameAsPhone"
                  checked={formData.whatsappSameAsPhone}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                WhatsApp number is same as phone number
              </label>
            </div>

            {!formData.whatsappSameAsPhone && (
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="login-input"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Graduation Year</label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="login-input"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="login-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Register
            </button>
            
            <div className="back-to-login">
              <Link to="/login" className="create-account">
                Already have an account? Login here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {showDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <p>Registration successful!</p>
            <button onClick={handleDialogClose} className="dialog-button">Okay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
