import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { FaSearch, FaIdCard } from 'react-icons/fa';
import { API_URL } from '../util/config';
import '../styles/AlumniList.css';

function AlumniList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [alumniData, setAlumniData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlumniData();
    }, []);

    const fetchAlumniData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view alumni list');
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/users/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setAlumniData(data.users);
            } else {
                if (response.status === 401) {
                    // Handle authentication error
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                setError(data.message || 'Failed to fetch alumni data');
            }
        } catch (error) {
            setError('Network error. Please try again later.');
            console.error('Error fetching alumni:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAlumni = alumniData.filter(alumni =>
        alumni.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alumni.workingAs && alumni.workingAs.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (alumni.technicalExpertise && alumni.technicalExpertise.some(skill =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );

    const handleViewProfile = (id) => {
        navigate(`/alumni-info/${id}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="alumni-page-layout">
            <div className="alumni-side-navbar">
                <NavBar />
            </div>

            <div className="alumni-main-content">
                <div className="search-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, branch, profession, or technical skills"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="search-icon" />
                    </div>
                </div>

                <div className="alumni-cards">
                    {filteredAlumni.map((alumni) => (
                        <div key={alumni.id} className="alumni-card">
                            <div className="alumni-info">
                                <img
                                    src={alumni.imageUrl}
                                    alt={alumni.fullName}
                                    className="alumni-image"
                                    onError={(e) => {
                                        e.target.src = `https://ny2fsuwtzwiq1t6s.public.blob.vercel-storage.com/default-user-JkNfvWTp7X1p14TXs1462jMc4PgNew.png`;
                                    }}
                                />
                                <div className="alumni-details">
                                    <h3>{alumni.fullName}</h3>
                                    <p>{alumni.branch} - ({alumni.graduatedYear})</p>
                                    <p>{alumni.currentPosition || 'Not specified'}</p>
                                    {alumni.technicalExpertise && alumni.technicalExpertise.length > 0 && (
                                        <div className="alumni-skills">
                                            {alumni.technicalExpertise.map((skill, index) => (
                                                <span key={index} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="view-profile">
                                <button
                                    className="view-profile-btn"
                                    onClick={() => handleViewProfile(alumni.id)}
                                >
                                    <FaIdCard className="profile-icon" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredAlumni.length === 0 && (
                        <div className="no-results">
                            No alumni found matching your search criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AlumniList;