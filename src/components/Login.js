import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../util/config';
import logo from '../assets/images/sdmp-logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/user-homepage');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Force a page reload to update header state
                window.location.href = '/user-homepage';
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <img src={logo} alt="SDM Polytechnic Logo" className="login-logo" />
                </div>
                <div className="login-right">
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2 className="login-title">Welcome Back!</h2>
                        <p className="login-subtitle">Login to your Alumni Account</p>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="login-input"
                                placeholder="Enter your email"
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
                                placeholder="Enter your password"
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
        </div>



    );
};

export default Login;
