import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { API_URL } from '../util/config';
import '../styles/AlumniInfo.css';

function AlumniInfo() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [alumniData, setAlumniData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAlumniData();
    }, [id]);

    const fetchAlumniData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view alumni details');
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setAlumniData(data.user);
            } else {
                if (response.status === 401) {
                    // Handle authentication error
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                setError(data.message || 'Failed to fetch alumni details');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="alumni-page-layout">
                <div className="alumni-side-navbar">
                    <NavBar />
                </div>
                <div className="alumni-main-content loading-content">
                    <div className="loading-message">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alumni-page-layout">
                <div className="alumni-side-navbar">
                    <NavBar />
                </div>
                <div className="alumni-main-content error-content">
                    <div className="error-message">{error}</div>
                    <button className="back-button" onClick={handleBack}>
                        &lt; Back
                    </button>
                </div>
            </div>
        );
    }

    if (!alumniData) {
        return (
            <div className="alumni-page-layout">
                <div className="alumni-side-navbar">
                    <NavBar />
                </div>
                <div className="alumni-main-content error-content">
                    <div className="error-message">Alumni not found</div>
                    <button className="back-button" onClick={handleBack}>
                        &lt; Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="alumni-page-layout">
            <div className="alumni-side-navbar">
                <NavBar />
            </div>

            <div className="alumni-main-content">
                <div className="alumni-info-wrapper">
                    <div className="alumni-info-container">
                        <div className="alumni-profile-section">
                            <div className="alumni-photo-container">
                                <img
                                    src={`${API_URL}/uploads/profiles/${alumniData.imageUrl}`}
                                    alt={alumniData.fullName}
                                    className="alumni-photo"
                                    onError={(e) => {
                                        e.target.src = `${API_URL}/uploads/profiles/default-profile.jpg`;
                                    }}
                                />
                            </div>

                            <div className="alumni-details-container">
                                <div className="detail-item">
                                    <h3>Name: {alumniData.fullName}</h3>
                                </div>
                                <div className="detail-item">
                                    <h3>Graduated Year: {alumniData.graduatedYear}</h3>
                                </div>
                                <div className="detail-item">
                                    <h3>Branch: {alumniData.branch}</h3>
                                </div>
                                <div className="detail-item">
                                    <h3>Working as: {alumniData.workingAs}</h3>
                                </div>
                                <div className="detail-item">
                                    <h3>Expertise: {alumniData.expertise}</h3>
                                </div>
                            </div>
                        </div>

                        <hr className="section-divider" />

                        <div className="education-section">
                            <h3>Education</h3>
                            <div className="education-item">
                                <h4>Higher Studies: {alumniData.higherStudies}</h4>
                            </div>
                        </div>

                        <hr className="section-divider" />

                        <div className="contact-section">
                            <h3>Contact Information:</h3>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <h4>Email: {alumniData.email}</h4>
                                </div>
                                <div className="contact-item">
                                    <h4>Phone: {alumniData.phone}</h4>
                                </div>
                                <div className="contact-item">
                                    <h4>WhatsApp: {alumniData.whatsappNumber}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="back-button-container">
                            <button className="back-button" onClick={handleBack}>
                             Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlumniInfo; 