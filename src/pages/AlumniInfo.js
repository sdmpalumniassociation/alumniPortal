import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { API_URL } from '../util/config';
import '../styles/AlumniInfo.css';
import { FaLinkedin, FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

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
                        {/* Profile Header Section */}
                        <div className="alumni-profile-section">
                            <div className="alumni-photo-container">
                                <img
                                    src={alumniData.imageUrl}
                                    alt={alumniData.fullName}
                                    className="alumni-photo"
                                    onError={(e) => {
                                        e.target.src = `https://ny2fsuwtzwiq1t6s.public.blob.vercel-storage.com/default-user-JkNfvWTp7X1p14TXs1462jMc4PgNew.png`;
                                    }}
                                />
                            </div>

                            <div className="alumni-details-container">
                                <h2 className="alumni-name">{alumniData.fullName}</h2>
                                <p className="alumni-id">Alumni ID: {alumniData.alumniId}</p>
                                <p className="alumni-branch">{alumniData.branch} ({alumniData.graduatedYear})</p>
                                <p className="alumni-position">{alumniData.currentPosition} at {alumniData.company}</p>
                            </div>
                        </div>

                        <hr className="section-divider" />

                        {/* Professional Information */}
                        <div className="professional-section">
                            <h3>Professional Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <h4>Current Role</h4>
                                    <p>{alumniData.workingAs}</p>
                                </div>
                                <div className="info-item">
                                    <h4>Company</h4>
                                    <p>{alumniData.company}</p>
                                </div>
                                <div className="info-item">
                                    <h4>Expertise</h4>
                                    <p>{alumniData.expertise}</p>
                                </div>
                            </div>
                        </div>

                        {/* Technical Expertise */}
                        {alumniData.technicalExpertise && Array.isArray(alumniData.technicalExpertise) && alumniData.technicalExpertise.length > 0 && (
                            <>
                                <hr className="section-divider" />
                                <div className="technical-section">
                                    <h3>Technical Skills</h3>
                                    <div className="skills-container">
                                        {alumniData.technicalExpertise.map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Education Section */}
                        <hr className="section-divider" />
                        <div className="education-section">
                            <h3>Education</h3>
                            <div className="education-list">
                                {/* Add Diploma from SDMP first */}
                                <div className="education-item">
                                    <div className="education-header">
                                        <h4>Diploma in {alumniData.branch}</h4>
                                        <span className="education-year">{alumniData.graduatedYear}</span>
                                    </div>
                                    <p className="education-institution">SDM Polytechnic, Ujire</p>
                                </div>

                                {/* Display other education details if available */}
                                {Array.isArray(alumniData.education) 
                                    ? alumniData.education.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <div className="education-header">
                                                <h4>{edu.degree} in {edu.field}</h4>
                                                <span className="education-year">{edu.year}</span>
                                            </div>
                                            <div className="education-details">
                                                <p className="education-institution">{edu.institution}</p>
                                            </div>
                                        </div>
                                    ))
                                    : (
                                        <div className="education-item">
                                            <div className="education-header">
                                                <h4>{alumniData.education || 'No education information available'}</h4>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        {/* Contact Information */}
                        <hr className="section-divider" />
                        <div className="contact-section">
                            <h3>Contact Information</h3>
                            <div className="contact-grid">
                                {alumniData.email && (
                                    <div className="contact-item">
                                        <FaEnvelope className="contact-icon" />
                                        <span>{alumniData.email}</span>
                                    </div>
                                )}
                                {alumniData.phone !== "Hidden" && (
                                    <div className="contact-item">
                                        <FaPhone className="contact-icon" />
                                        <span>{alumniData.phone}</span>
                                    </div>
                                )}
                                {alumniData.whatsappNumber !== "Hidden" && (
                                    <div className="contact-item">
                                        <FaWhatsapp className="contact-icon" />
                                        <span>{alumniData.whatsappNumber}</span>
                                    </div>
                                )}
                                {alumniData.linkedIn && (
                                    <div className="contact-item">
                                        <FaLinkedin className="contact-icon" />
                                        <a href={alumniData.linkedIn} target="_blank" rel="noopener noreferrer">
                                            LinkedIn Profile
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="back-button-container">
                            <button className="back-button" onClick={handleBack}>
                                Back to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlumniInfo; 