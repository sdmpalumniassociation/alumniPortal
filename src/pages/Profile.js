import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import '../styles/Profile.css';

function Profile() {
  // Sample user data
  const initialUserData = {
    name: "John Doe",
    role: "Alumni",
    graduationYear: "2020",
    branch: "Computer Science and Engineering",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    whatsAppNumber: "+91 9876543210",
    address: "123 Main Street, Chennai, Tamil Nadu",
    linkedIn: "linkedin.com/in/johndoe",
    currentPosition: "Software Engineer",
    company: "Tech Solutions Inc.",
    hidePhoneNumber: false,
    technicalExpertise: [
      "React.js", 
      "Node.js", 
      "JavaScript", 
      "TypeScript", 
      "Python", 
      "AWS", 
      "Docker", 
      "GraphQL", 
      "MongoDB", 
      "SQL"
    ],
    education: [
      {
        degree: "B.Tech",
        field: "Computer Science and Engineering",
        institution: "ABC Engineering College",
        year: "2016-2020",
        score: "8.7 CGPA"
      },
      {
        degree: "M.Tech",
        field: "Artificial Intelligence",
        institution: "XYZ University",
        year: "2021-2023",
        score: "9.2 CGPA"
      }
    ]
  };

  const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [tempUserData, setTempUserData] = useState({...initialUserData});
  const [tempSkill, setTempSkill] = useState('');
  const [whatsAppSameAsPhone, setWhatsAppSameAsPhone] = useState(
    initialUserData.phone === initialUserData.whatsAppNumber
  );

  const handleEdit = () => {
    setTempUserData({...userData});
    setWhatsAppSameAsPhone(userData.phone === userData.whatsAppNumber);
    setEditMode(true);
  };

  const handleSave = () => {
    setUserData(tempUserData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleInputChange = (e, field) => {
    setTempUserData({
      ...tempUserData,
      [field]: e.target.value
    });

    // If whatsAppSameAsPhone is checked and the phone is changing, update whatsApp number too
    if (field === 'phone' && whatsAppSameAsPhone) {
      setTempUserData(prev => ({
        ...prev,
        whatsAppNumber: e.target.value
      }));
    }
  };

  const handleToggleChange = (field) => {
    setTempUserData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleWhatsAppSameAsPhone = (e) => {
    const isChecked = e.target.checked;
    setWhatsAppSameAsPhone(isChecked);
    
    if (isChecked) {
      // If checked, set WhatsApp number to phone number
      setTempUserData(prev => ({
        ...prev,
        whatsAppNumber: prev.phone
      }));
    }
  };

  const handleSkillChange = (e) => {
    setTempSkill(e.target.value);
  };

  const addSkill = () => {
    if (tempSkill.trim() !== '') {
      setTempUserData({
        ...tempUserData,
        technicalExpertise: [...tempUserData.technicalExpertise, tempSkill.trim()]
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
    const updatedEducation = [...tempUserData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setTempUserData({
      ...tempUserData,
      education: updatedEducation
    });
  };

  // Function to mask phone numbers for privacy
  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    // Hide the number except last 4 digits
    const lastFourDigits = phoneNumber.slice(-4);
    return `**********${lastFourDigits}`;
  };

  // Function to display the phone number based on privacy settings
  const displayPhoneNumber = (phoneNumber) => {
    if (!userData.hidePhoneNumber) {
      return phoneNumber;
    }
    return maskPhoneNumber(phoneNumber);
  };

  return (
    <div className="profile-page-layout">
      <div className="profile-side-navbar">
        <NavBar />
      </div>
      
      <div className="profile-main-content">
        <div className="profile-wrapper">
          <div className="profile-heading">
            <h1>Profile</h1>
            <p>View and manage your personal information</p>
          </div>
          
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">
                <img src="/icons/user-avatar.png" alt="Profile" />
              </div>
              <div className="profile-name-info">
                <h2>{userData.name}</h2>
                <p>{userData.role} • {userData.graduationYear}</p>
              </div>
              <div className="profile-edit-button">
                {!editMode ? (
                  <button onClick={handleEdit}>Edit Profile</button>
                ) : (
                  <div className="edit-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="profile-content">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="info-label">Name</span>
                    {!editMode ? (
                      <span className="info-value">{userData.name}</span>
                    ) : (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={tempUserData.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                      />
                    )}
                  </div>
                  <div className="profile-info-item">
                    <span className="info-label">Role</span>
                    {!editMode ? (
                      <span className="info-value">{userData.role}</span>
                    ) : (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={tempUserData.role}
                        onChange={(e) => handleInputChange(e, 'role')}
                      />
                    )}
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
              
              <div className="profile-section">
                <h3>Education</h3>
                <div className="education-list">
                  {(editMode ? tempUserData.education : userData.education).map((edu, index) => (
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
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                              />
                            </div>
                            <div className="education-edit-field">
                              <label>Field</label>
                              <input
                                type="text"
                                value={edu.field}
                                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="education-edit-row">
                            <div className="education-edit-field">
                              <label>Institution</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                              />
                            </div>
                            <div className="education-edit-field">
                              <label>Year</label>
                              <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="education-edit-row">
                            <div className="education-edit-field">
                              <label>Score</label>
                              <input
                                type="text"
                                value={edu.score}
                                onChange={(e) => handleEducationChange(index, 'score', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
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
                      <span className="info-value">{displayPhoneNumber(userData.phone)}</span>
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
                              checked={tempUserData.hidePhoneNumber}
                              onChange={() => handleToggleChange('hidePhoneNumber')}
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
                      <span className="info-value">{displayPhoneNumber(userData.whatsAppNumber)}</span>
                    ) : (
                      <div className="whatsapp-input-group">
                        <input 
                          type="text" 
                          className="edit-input" 
                          value={tempUserData.whatsAppNumber}
                          onChange={(e) => handleInputChange(e, 'whatsAppNumber')}
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
                </div>
                
                <h4 className="subsection-title">Technical Expertise</h4>
                {!editMode ? (
                  <div className="skills-container">
                    {userData.technicalExpertise.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <div className="edit-skills-section">
                    <div className="skills-container">
                      {tempUserData.technicalExpertise.map((skill, index) => (
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
