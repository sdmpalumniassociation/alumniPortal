import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import logo from '../assets/images/sdmp-logo.png';
import { API_URL } from '../util/config';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        alumniId: '',
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

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    // Fetch the next available alumni ID when component mounts
    useEffect(() => {
        const fetchNextAlumniId = async () => {
            try {
                const response = await fetch(`${API_URL}/users/next-alumni-id`);
                const data = await response.json();
                if (response.ok) {
                    setFormData(prev => ({
                        ...prev,
                        alumniId: data.nextAlumniId
                    }));
                }
            } catch (error) {
                console.error('Error fetching next alumni ID:', error);
            }
        };

        fetchNextAlumniId();
    }, []);

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return '';
    };

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

            // Password validation
            if (name === 'password') {
                const passwordError = validatePassword(value);
                setErrors(prev => ({
                    ...prev,
                    password: passwordError,
                    confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : ''
                }));
            }

            // Confirm password validation
            if (name === 'confirmPassword') {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: value !== formData.password ? 'Passwords do not match' : ''
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate password
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setErrors(prev => ({ ...prev, password: passwordError }));
            setLoading(false);
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowDialog(true);
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        navigate('/login');
    };

    const branches = [
        'Civil Engineering',
        'Computer Science & Engineering',
        'Electronics & Communication Engineering',
        'Mechanical Engineering',
        'Information Science Engineering'
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
                        <h2 className="register-title">Create an Account</h2>
                        <p className="register-subtitle">Join the SDM Polytechnic Alumni Network</p>

                        {/* Display dialog for successful registration */}
                        {showDialog && (
                            <div className="dialog">
                                <div className="dialog-content">
                                    <h3>Registration Successful!</h3>
                                    <p>Your account has been created successfully.</p>
                                    <p>Please check your email for verification instructions.</p>
                                    <button onClick={handleDialogClose} className="dialog-button">
                                        Go to Login
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="login-input"
                                placeholder="Enter your full name"
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="alumniId">Alumni ID</label>
                            <input
                                type="text"
                                id="alumniId"
                                name="alumniId"
                                value={formData.alumniId}
                                onChange={handleChange}
                                className="login-input"
                                placeholder="Alumni ID"
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="login-input"
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="form-row">
                                <div className="country-code">
                                    <select
                                        id="countryCode"
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        className="login-input"
                                    >
                                        {countryCodes.map(country => (
                                            <option key={country.code} value={country.code}>
                                                {country.code} ({country.country})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="phone-number">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="login-input"
                                        placeholder="Enter your phone number"
                                        required
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="checkbox-group">
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
                                <label htmlFor="whatsappNumber">WhatsApp Number</label>
                                <input
                                    type="text"
                                    id="whatsappNumber"
                                    name="whatsappNumber"
                                    value={formData.whatsappNumber}
                                    onChange={handleChange}
                                    className="login-input"
                                    placeholder="Enter your WhatsApp number"
                                />
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="branch">Branch</label>
                                <select
                                    id="branch"
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
                                <label htmlFor="graduationYear">Graduation Year</label>
                                <select
                                    id="graduationYear"
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
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`login-input ${errors.password ? 'error-input' : ''}`}
                                placeholder="Create a password (minimum 8 characters)"
                                required
                                autoComplete="new-password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`login-input ${errors.confirmPassword ? 'error-input' : ''}`}
                                placeholder="Confirm your password"
                                required
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        <div className="back-to-login">
                            <Link to="/login" className="create-account">
                                Already have an account? Login here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
