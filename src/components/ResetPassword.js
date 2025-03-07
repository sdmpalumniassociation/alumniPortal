import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../util/config';
import logo from '../assets/images/sdmp-logo.png';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    // Verify token when component mounts
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_URL}/users/verify-reset-token/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setIsTokenValid(true);
                } else {
                    setError(data.message || 'Invalid or expired reset link');
                }
            } catch (error) {
                setError('Network error. Please try again later.');
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${API_URL}/users/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (error) {
            setError('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTokenValid && error) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-left">
                        <img src={logo} alt="SDM Polytechnic Logo" className="login-logo" />
                    </div>
                    <div className="login-right">
                        <div className="login-form">
                            <h2 className="forgot-password-title">Invalid Reset Link</h2>
                            <div className="alert alert-danger">{error}</div>
                            <div className="back-to-login">
                                <Link to="/forgot-password" className="create-account">
                                    Request New Reset Link
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <img src={logo} alt="SDM Polytechnic Logo" className="login-logo" />
                </div>
                <div className="login-right">
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2 className="forgot-password-title">Reset Password</h2>
                        <p className="forgot-password-text">
                            Please enter your new password below.
                        </p>

                        {message && (
                            <div className="alert alert-success">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                placeholder="Enter new password"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="login-input"
                                placeholder="Confirm new password"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Reset Password'}
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

export default ResetPassword; 