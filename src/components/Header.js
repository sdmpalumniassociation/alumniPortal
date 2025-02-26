import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/sdmp-logo.png'; 


const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src={logo} alt="SDM Polytechnic Logo" className="header-logo" />
          <h1 className="header-title">Alumni Association</h1>
        </div>
        <div className="header-right">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "header-link active" : "header-link"
            }
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/login" 
            className={({ isActive }) => 
              isActive ? "header-link login-link active" : "header-link login-link"
            }
          >
            Login
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
