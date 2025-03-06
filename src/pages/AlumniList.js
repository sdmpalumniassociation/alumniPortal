import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { FaSearch, FaIdCard } from 'react-icons/fa';
import '../styles/AlumniList.css';

function AlumniList() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Sample alumni data - replace with actual data from your backend
  const alumniData = [
    {
      id: 1,
      fullName: "Sathesh",
      branch: "Computer Science and Engineering",
      graduatedYear: "2019",
      workingAs: "Software Developer",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 2,
      fullName: "Rajesh Kumar",
      branch: "Computer Science and Engineering",
      graduatedYear: "2024",
      workingAs: "Software Engineer",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 3,
      fullName: "Ranjith",
      branch: "Computer Science and Engineering",
      graduatedYear: "2020",
      workingAs: "Cyber Security Engineer",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 4,
      fullName: "Sai Kumar",
      branch: "Computer Science and Engineering",
      graduatedYear: "2015",
      workingAs: "Software Engineer",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 5,
      fullName: "Full Name",
      branch: "Branch",
      graduatedYear: "graduated year",
      workingAs: "Working as:",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 6,
      fullName: "Full Name",
      branch: "Branch",
      graduatedYear: "graduated year",
      workingAs: "Working as:",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 7,
      fullName: "Full Name",
      branch: "Branch",
      graduatedYear: "graduated year",
      workingAs: "Working as:",
      imageUrl: "https://via.placeholder.com/100"
    },
    {
      id: 8,
      fullName: "Full Name",
      branch: "Branch",
      graduatedYear: "graduated year",
      workingAs: "Working as:",
      imageUrl: "https://via.placeholder.com/100"
    },
    // Add more alumni data as needed
  ];

  const filteredAlumni = alumniData.filter(alumni =>
    alumni.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alumni.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alumni.workingAs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (id) => {
    navigate(`/alumni-info/${id}`);
  };

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
              placeholder="Search"
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
                <img src={alumni.imageUrl} alt={alumni.fullName} className="alumni-image" />
                <div className="alumni-details">
                  <h3>{alumni.fullName}</h3>
                  <p>{alumni.branch} - ({alumni.graduatedYear})</p>
                  <p>{alumni.workingAs}</p>
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
        </div>
      </div>
    </div>
  );
}

export default AlumniList;