import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/AlumniInfo.css';
import NavBar from './NavBar';

function AlumniInfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample alumni data - in a real app, you would fetch this based on the ID
  const alumniData = {
    id: id,
    fullName: "Name:",
    graduatedYear: "Graduated Year:",
    branch: "Branch:",
    workingAs: "Working as:",
    expertise: "Expertise:",
    education: "Education:",
    higherStudies: "Higher Studies:",
    imageUrl: "../assets/images/default-user.png"
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
    <NavBar />
    <div className="alumni-info-page">
      <div className="alumni-info-container">
        <div className="alumni-profile-section">
          <div className="alumni-photo-container">
            <img src={alumniData.imageUrl} alt={alumniData.fullName} className="alumni-photo" />
            <p className="photo-label">(Photo)</p>
          </div>
          
          <div className="alumni-details-container">
            <div className="detail-item">
              <h3>{alumniData.fullName}</h3>
            </div>
            <div className="detail-item">
              <h3>{alumniData.graduatedYear}</h3>
            </div>
            <div className="detail-item">
              <h3>{alumniData.branch}</h3>
            </div>
            <div className="detail-item">
              <h3>{alumniData.workingAs}</h3>
            </div>
            <div className="detail-item">
              <h3>{alumniData.expertise}</h3>
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        <div className="education-section">
          <h3>{alumniData.education}</h3>
          <div className="education-item">
            <h4>{alumniData.higherStudies}</h4>
          </div>
        </div>

        <div className="back-button-container">
          <button className="back-button" onClick={handleBack}>
            &lt; Back
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AlumniInfo;