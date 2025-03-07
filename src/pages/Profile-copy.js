import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { API_URL } from '../util/config';
import '../styles/Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        branch: '',
        graduationYear: '',
        workingAs: '',
        expertise: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch profile data
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setProfile(data.user);
                setFormData({
                    fullName: data.user.fullName,
                    email: data.user.email,
                    phone: data.user.phone,
                    whatsappNumber: data.user.whatsappNumber,
                    branch: data.user.branch,
                    graduationYear: data.user.graduationYear,
                    workingAs: data.user.workingAs,
                    expertise: data.user.expertise,
                });
                setError(null);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            if (selectedImage) {
                formDataToSend.append('profileImage', selectedImage);
            }

            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Profile updated successfully');
                setProfile(data.user);
                setIsEditing(false);
                setError(null);
                setSelectedImage(null);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    // Toggle phone visibility
    const togglePhoneVisibility = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/users/toggle-phone`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile({ ...profile, hidePhone: data.hidePhone });
                setSuccess('Phone visibility updated');
                setError(null);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update phone visibility');
        }
    };

    // Clear success message after 3 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="profile-page-layout">
            <div className="profile-side-navbar">
                <NavBar />
            </div>

            <div className="profile-main-content">
                <div className="profile-wrapper">
                    <Card className="profile-card">
                        <Card.Header>
                            <h4>My Profile</h4>
                            {!isEditing && (
                                <Button
                                    variant="primary"
                                    onClick={() => setIsEditing(true)}
                                    className="edit-profile-btn"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            {isEditing ? (
                                <Form onSubmit={handleSubmit} className="profile-form">
                                    <div className="profile-image-upload">
                                        <img
                                            src={previewUrl || `${API_URL}/uploads/profiles/${profile.imageUrl}`}
                                            alt="Profile"
                                            className="profile-image"
                                            onError={(e) => {
                                                e.target.src = `${API_URL}/uploads/profiles/default-profile.jpg`;
                                            }}
                                        />
                                        <Form.Group>
                                            <Form.Label>Profile Image:</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    <Form.Group>
                                        <Form.Label>Full Name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Phone Number:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your phone number"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>WhatsApp Number:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your WhatsApp number"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Branch:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your branch"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Graduation Year:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your graduation year"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Working As:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="workingAs"
                                            value={formData.workingAs}
                                            onChange={handleChange}
                                            placeholder="Enter your current position"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Expertise:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="expertise"
                                            value={formData.expertise}
                                            onChange={handleChange}
                                            placeholder="Enter your areas of expertise"
                                        />
                                    </Form.Group>

                                    <div className="profile-actions">
                                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className="profile-info">
                                    <div className="profile-image-container">
                                        <img
                                            src={`${API_URL}/uploads/profiles/${profile.imageUrl}`}
                                            alt="Profile"
                                            className="profile-image"
                                            onError={(e) => {
                                                e.target.src = `${API_URL}/uploads/profiles/default-profile.jpg`;
                                            }}
                                        />
                                    </div>
                                    <div className="profile-field">
                                        <strong>Full Name:</strong>
                                        <span className="profile-field-value">{profile.fullName}</span>
                                    </div>
                                    <div className="profile-field">
                                        <strong>Email:</strong>
                                        <span className="profile-field-value">{profile.email}</span>
                                    </div>
                                    <div className="profile-field">
                                        <strong>Phone Number:</strong>
                                        <span className="profile-field-value">
                                            {profile.hidePhone ? '*** (Hidden)' : profile.phone}
                                        </span>
                                        <button
                                            onClick={togglePhoneVisibility}
                                            className="visibility-toggle"
                                        >
                                            {profile.hidePhone ? 'Show' : 'Hide'}
                                        </button>
                                    </div>
                                    <div className="profile-field">
                                        <strong>WhatsApp Number:</strong>
                                        <span className="profile-field-value">{profile.whatsappNumber}</span>
                                    </div>
                                    <div className="profile-field">
                                        <strong>Branch:</strong>
                                        <span className="profile-field-value">{profile.branch}</span>
                                    </div>
                                    <div className="profile-field">
                                        <strong>Graduation Year:</strong>
                                        <span className="profile-field-value">{profile.graduationYear}</span>
                                    </div>
                                    <div className="profile-field">
                                        <strong>Working As:</strong>
                                        <span className="profile-field-value">{profile.workingAs}</span>
                                    </div>
                                    <div className="profile-field">
                                        <strong>Expertise:</strong>
                                        <span className="profile-field-value">{profile.expertise}</span>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Profile;
