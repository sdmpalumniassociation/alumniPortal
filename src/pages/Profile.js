import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { API_URL } from '../util/config';
import '../styles/Profile.css';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);
    const [tempSkill, setTempSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [whatsAppSameAsPhone, setWhatsAppSameAsPhone] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch user profile data
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view profile');
                return;
            }

            const response = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data.user);
                setWhatsAppSameAsPhone(data.user.phone === data.user.whatsappNumber);
            } else {
                setError(data.message || 'Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setTempUserData({ ...userData });
        setWhatsAppSameAsPhone(userData.phone === userData.whatsappNumber);
        setEditMode(true);
        setError(null);
        setSuccess(null);
    };

    const handleCancel = () => {
        setEditMode(false);
        setTempUserData(null);
        setSelectedFile(null);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (e, field) => {
        setTempUserData({
            ...tempUserData,
            [field]: e.target.value
        });

        if (field === 'phone' && whatsAppSameAsPhone) {
            setTempUserData(prev => ({
                ...prev,
                whatsappNumber: e.target.value
            }));
        }
    };

    const handleWhatsAppSameAsPhone = (e) => {
        const isChecked = e.target.checked;
        setWhatsAppSameAsPhone(isChecked);

        if (isChecked) {
            setTempUserData(prev => ({
                ...prev,
                whatsappNumber: prev.phone
            }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSkillChange = (e) => {
        setTempSkill(e.target.value);
    };

    const addSkill = () => {
        if (tempSkill.trim() !== '') {
            setTempUserData({
                ...tempUserData,
                technicalExpertise: [...(tempUserData.technicalExpertise || []), tempSkill.trim()]
            });
            setTempSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setTempUserData({
            ...tempUserData,
            technicalExpertise: tempUserData.technicalExpertise.filter(
                skill => skill !== skillToRemove
            )
        });
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...(tempUserData.education || [])];
        if (!updatedEducation[index]) {
            updatedEducation[index] = {};
        }
        updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: value
        };
        setTempUserData({
            ...tempUserData,
            education: updatedEducation
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');

            // Create a regular object instead of FormData for better handling of arrays
            const updateData = {
                ...tempUserData,
                technicalExpertise: tempUserData.technicalExpertise || [],
                education: tempUserData.education || []
            };

            // Create FormData only for the file
            const formData = new FormData();
            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            }

            // First, upload the file if there is one
            let imageUrl = null;
            if (selectedFile) {
                const fileResponse = await fetch(`${API_URL}/users/profile/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (fileResponse.ok) {
                    const fileData = await fileResponse.json();
                    imageUrl = fileData.imageUrl;
                }
            }

            // Then update the profile with all data
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...updateData,
                    ...(imageUrl && { imageUrl })
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Profile updated successfully');
                setUserData(data.user);
                setEditMode(false);
                setSelectedFile(null);
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Network error occurred');
        }
    };

    if (loading) {
        return (
            <div className="profile-page-layout">
                <div className="profile-side-navbar">
                    <NavBar />
                </div>
                <div className="profile-main-content">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className="profile-page-layout">
                <div className="profile-side-navbar">
                    <NavBar />
                </div>
                <div className="profile-main-content">
                    <div className="error-message">{error}</div>
                </div>
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
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="profile-heading">
                        <h1>Profile</h1>
                        <p>View and manage your personal information</p>
                    </div>

                    <div className="profile-container">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <img
                                    src={userData.imageUrl}
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.src = `https://ny2fsuwtzwiq1t6s.public.blob.vercel-storage.com/default-user-JkNfvWTp7X1p14TXs1462jMc4PgNew.png`;
                                    }}
                                />
                                {editMode && (
                                    <div className="profile-image-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            name="profileImage"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="profile-name-info">
                                <h2>{userData.fullName}</h2>
                                <p>{userData.role} • {userData.graduationYear}</p>
                            </div>
                            <div className="profile-edit-button">
                                {!editMode ? (
                                    <button onClick={handleEdit}>Edit Profile</button>
                                ) : (
                                    <div className="edit-buttons">
                                        <button className="save-button" onClick={handleSubmit}>Save</button>
                                        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profile-content">
                            {/* Personal Information Section */}
                            <div className="profile-section">
                                <h3>Personal Information</h3>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="info-label">Full Name</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.fullName}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.fullName}
                                                onChange={(e) => handleInputChange(e, 'fullName')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Alumni ID</span>
                                        <span className="info-value">{userData.alumniId}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Graduation Year</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.graduationYear}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.graduationYear}
                                                onChange={(e) => handleInputChange(e, 'graduationYear')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Branch</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.branch}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.branch}
                                                onChange={(e) => handleInputChange(e, 'branch')}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Education Section */}
                            <div className="profile-section">
                                <h3>Education</h3>
                                <div className="education-list">
                                    {(editMode ? (tempUserData.education || []) : (userData.education || [])).map((edu, index) => (
                                        <div key={index} className="education-item">
                                            {!editMode ? (
                                                <>
                                                    <div className="education-header">
                                                        <h4>{edu.degree} in {edu.field}</h4>
                                                        <span className="education-year">{edu.year}</span>
                                                    </div>
                                                    <div className="education-details">
                                                        <p className="education-institution">{edu.institution}</p>
                                                        <p className="education-score">Score: {edu.score}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="education-edit">
                                                    <div className="education-edit-row">
                                                        <div className="education-edit-field">
                                                            <label>Degree</label>
                                                            <input
                                                                type="text"
                                                                value={edu.degree || ''}
                                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="education-edit-field">
                                                            <label>Field</label>
                                                            <input
                                                                type="text"
                                                                value={edu.field || ''}
                                                                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="education-edit-row">
                                                        <div className="education-edit-field">
                                                            <label>Institution</label>
                                                            <input
                                                                type="text"
                                                                value={edu.institution || ''}
                                                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="education-edit-field">
                                                            <label>Year</label>
                                                            <input
                                                                type="text"
                                                                value={edu.year || ''}
                                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="education-edit-row">
                                                        <div className="education-edit-field">
                                                            <label>Score</label>
                                                            <input
                                                                type="text"
                                                                value={edu.score || ''}
                                                                onChange={(e) => handleEducationChange(index, 'score', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {editMode && (
                                        <button
                                            className="add-education-button"
                                            onClick={() => setTempUserData({
                                                ...tempUserData,
                                                education: [...(tempUserData.education || []), {}]
                                            })}
                                        >
                                            Add Education
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="profile-section">
                                <h3>Contact Information</h3>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="info-label">Email</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.email}</span>
                                        ) : (
                                            <input
                                                type="email"
                                                className="edit-input"
                                                value={tempUserData.email}
                                                onChange={(e) => handleInputChange(e, 'email')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Phone</span>
                                        {!editMode ? (
                                            <span className="info-value">
                                                {userData.hidePhone ? '*** (Hidden)' : `${userData.countryCode} ${userData.phone}`}
                                            </span>
                                        ) : (
                                            <div className="phone-input-group">
                                                <input
                                                    type="text"
                                                    className="edit-input"
                                                    value={tempUserData.phone}
                                                    onChange={(e) => handleInputChange(e, 'phone')}
                                                />
                                                <div className="toggle-wrapper">
                                                    <label className="toggle-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempUserData.hidePhone}
                                                            onChange={() => setTempUserData({
                                                                ...tempUserData,
                                                                hidePhone: !tempUserData.hidePhone
                                                            })}
                                                            className="toggle-input"
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                    <span className="toggle-text">Hide my phone numbers</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">WhatsApp Number</span>
                                        {!editMode ? (
                                            <span className="info-value">
                                                {userData.hidePhone ? '*** (Hidden)' : `${userData.countryCode} ${userData.whatsappNumber}`}
                                            </span>
                                        ) : (
                                            <div className="whatsapp-input-group">
                                                <input
                                                    type="text"
                                                    className="edit-input"
                                                    value={tempUserData.whatsappNumber}
                                                    onChange={(e) => handleInputChange(e, 'whatsappNumber')}
                                                    disabled={whatsAppSameAsPhone}
                                                />
                                                <div className="checkbox-wrapper">
                                                    <input
                                                        type="checkbox"
                                                        id="whatsapp-same-as-phone"
                                                        checked={whatsAppSameAsPhone}
                                                        onChange={handleWhatsAppSameAsPhone}
                                                    />
                                                    <label htmlFor="whatsapp-same-as-phone">Same as Phone Number</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Address</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.address}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.address}
                                                onChange={(e) => handleInputChange(e, 'address')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">LinkedIn</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.linkedIn}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.linkedIn}
                                                onChange={(e) => handleInputChange(e, 'linkedIn')}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information Section */}
                            <div className="profile-section">
                                <h3>Professional Information</h3>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="info-label">Current Position</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.currentPosition}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.currentPosition}
                                                onChange={(e) => handleInputChange(e, 'currentPosition')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Company</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.company}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.company}
                                                onChange={(e) => handleInputChange(e, 'company')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Working As</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.workingAs}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.workingAs}
                                                onChange={(e) => handleInputChange(e, 'workingAs')}
                                            />
                                        )}
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Expertise</span>
                                        {!editMode ? (
                                            <span className="info-value">{userData.expertise}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={tempUserData.expertise}
                                                onChange={(e) => handleInputChange(e, 'expertise')}
                                            />
                                        )}
                                    </div>
                                </div>

                                <h4 className="subsection-title">Technical Expertise</h4>
                                {!editMode ? (
                                    <div className="skills-container">
                                        {(userData.technicalExpertise || []).map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="edit-skills-section">
                                        <div className="skills-container">
                                            {(tempUserData.technicalExpertise || []).map((skill, index) => (
                                                <span key={index} className="skill-tag editable">
                                                    {skill}
                                                    <button
                                                        className="remove-skill"
                                                        onClick={() => removeSkill(skill)}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="add-skill-input">
                                            <input
                                                type="text"
                                                placeholder="Add a skill"
                                                value={tempSkill}
                                                onChange={handleSkillChange}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            />
                                            <button onClick={addSkill}>Add</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
