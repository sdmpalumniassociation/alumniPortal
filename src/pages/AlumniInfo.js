import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/AlumniInfo.css';

function AlumniInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [alumniData, setAlumniData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch data from an API
    // For this example, we'll use mock data
    const fetchAlumniData = () => {
      setLoading(true);
      
      // Mock alumni database
      const alumniDatabase = [
        {
          id: "1",
          fullName: "Sathesh",
          graduatedYear: "2019",
          branch: "Computer Science and Engineering",
          workingAs: "Software Developer",
          expertise: "Web Development, React, Node.js",
          education: "Education:",
          higherStudies: "Masters in Computer Science, MIT (2021-2023)",
          email: "sathesh@example.com",
          phone: "+91 9876543210",
          imageUrl: "https://via.placeholder.com/150"
        },
        {
          id: "2",
          fullName: "Rajesh Kumar",
          graduatedYear: "2024",
          branch: "Computer Science and Engineering",
          workingAs: "Software Engineer",
          expertise: "Machine Learning, Python, TensorFlow",
          education: "Education:",
          higherStudies: "PhD in Artificial Intelligence, Stanford (In Progress)",
          email: "rajesh.kumar@example.com",
          phone: "+91 9876543211",
          imageUrl: "https://via.placeholder.com/150"
        },
        {
          id: "3",
          fullName: "Ranjith",
          graduatedYear: "2020",
          branch: "Computer Science and Engineering",
          workingAs: "Cyber Security Engineer",
          expertise: "Network Security, Ethical Hacking, Cloud Security",
          education: "Education:",
          higherStudies: "Certified Ethical Hacker (CEH), Certified Information Systems Security Professional (CISSP)",
          email: "ranjith@example.com",
          phone: "+91 9876543212",
          imageUrl: "https://via.placeholder.com/150"
        },
        {
          id: "4",
          fullName: "Sai Kumar",
          graduatedYear: "2015",
          branch: "Computer Science and Engineering",
          workingAs: "Software Engineer",
          expertise: "Cloud Architecture, AWS, DevOps",
          education: "Education:",
          higherStudies: "MBA in Technology Management, IIM Bangalore (2017-2019)",
          email: "sai.kumar@example.com",
          phone: "+91 9876543213",
          imageUrl: "https://via.placeholder.com/150"
        }
      ];

      // Find the alumni with the matching ID
      const alumni = alumniDatabase.find(a => a.id === id);
      
      // If found, set the data
      if (alumni) {
        setAlumniData(alumni);
      } else {
        // If not found, use placeholder data
        setAlumniData({
          id: id,
          fullName: "Name:",
          graduatedYear: "Graduated Year:",
          branch: "Branch:",
          workingAs: "Working as:",
          expertise: "Expertise:",
          education: "Education:",
          higherStudies: "Higher Studies:",
          email: "Email:",
          phone: "Phone:",
          imageUrl: "https://via.placeholder.com/150"
        });
      }
      
      setLoading(false);
    };

    fetchAlumniData();
  }, [id]);

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
                <img src={alumniData.imageUrl} alt={alumniData.fullName} className="alumni-photo" />
                <p className="photo-label">(Photo)</p>
              </div>
              
              <div className="alumni-details-container">
                <div className="detail-item">
                  <h3>Name: {alumniData.fullName.includes("Name:") ? "" : alumniData.fullName}</h3>
                </div>
                <div className="detail-item">
                  <h3>Graduated Year: {alumniData.graduatedYear.includes("Graduated Year:") ? "" : alumniData.graduatedYear}</h3>
                </div>
                <div className="detail-item">
                  <h3>Branch: {alumniData.branch.includes("Branch:") ? "" : alumniData.branch}</h3>
                </div>
                <div className="detail-item">
                  <h3>Working as: {alumniData.workingAs.includes("Working as:") ? "" : alumniData.workingAs}</h3>
                </div>
                <div className="detail-item">
                  <h3>Expertise: {alumniData.expertise.includes("Expertise:") ? "" : alumniData.expertise}</h3>
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="education-section">
              <h3>{alumniData.education}</h3>
              <div className="education-item">
                <h4>Higher Studies: {alumniData.higherStudies.includes("Higher Studies:") ? "" : alumniData.higherStudies}</h4>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="contact-section">
              <h3>Contact Information:</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <h4>Email: {alumniData.email.includes("Email:") ? "" : alumniData.email}</h4>
                </div>
                <div className="contact-item">
                  <h4>Phone: {alumniData.phone.includes("Phone:") ? "" : alumniData.phone}</h4>
                </div>
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
    </div>
  );
}

export default AlumniInfo; 