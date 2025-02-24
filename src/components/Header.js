import React from 'react';
import logo from '../assets/images/sdmp-logo.png'; 


const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="SDM Polytechnic Logo" className="header-logo" />
        <h1 className="header-title">Alumni Association</h1>
      </div>
    </header>
  );
};

export default Header;
