import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../util/config';
import logo from '../assets/images/sdmp-logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${API_URL}/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('If your email is registered, you will receive password reset instructions.');
                setEmail(''); // Clear the email field
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (error) {
            setError('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
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
                        <h2 className="forgot-password-title">Forgot Password</h2>
                        <p className="forgot-password-text">
                            Enter your email address and we'll send you instructions to reset your password.
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
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                placeholder="Enter your email address"
                                required
                                disabled={isLoading}
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

export default ForgotPassword;

