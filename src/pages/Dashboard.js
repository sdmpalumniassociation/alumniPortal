import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/Dashboard.css';
import invitation from '../assets/images/Invitation.png';

function Dashboard() {
  return (
    <div className="dashboard-page-layout">
      <div className="dashboard-side-navbar">
        <NavBar />
      </div>
      
      <div className="dashboard-main-content">
      <div className="coming-soon-message">
                <h2>More Features Coming Soon!</h2>
                <img className='invitation-image' src={invitation} alt="Invitation" />
                <p>We're working hard to build an amazing dashboard experience for you.</p>
                <p>This section is currently under development and will be available soon.</p>
              </div>
      </div>
    </div>
  );
}

export default Dashboard;
