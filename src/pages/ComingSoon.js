import React from 'react';
import logo from '../assets/images/sdmp-logo.png'; 


const ComingSoon = () => {
  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <img src={logo} alt="SDM Polytechnic Logo" className="main-logo" />
        <h2 className="welcome-text">Welcome to SDM Polytechnic Alumni Association!</h2>
        <h1 className="coming-soon-text">WE ARE COMING SOON!</h1>
      </div>
    </div>
  );
};

export default ComingSoon;
