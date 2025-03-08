import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../util/config';
import logo from '../assets/images/sdmp-logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/user-homepage');
                window.location.reload();
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
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
                        <h2 className="login-title">Login to Alumni Portal</h2>
                        <p className="login-subtitle">Welcome back to SDM Polytechnic Alumni Network</p>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email / Alumni ID / Phone Number</label>
                            <input
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                className="login-input"
                                placeholder="Enter your email, alumni ID, or phone number"
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

                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="register-link">
                            <p>Don't have an account?</p>
                            <Link to="/register" className="create-account">
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
