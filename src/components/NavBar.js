import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaUsers, FaChalkboardTeacher, FaSignOutAlt } from "react-icons/fa";

const NavBar = () => {
  const location = useLocation();

  return (
    <div className="navbar-container">
      
      {/* Sidebar */}
      <div className="sidebar">

      <Link 
          to="/user-homepage" 
          className={`sidebar-item ${location.pathname === '/user-homepage' ? 'active' : ''}`}
        >
          <FaUser />
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/profile" 
          className={`sidebar-item ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <FaUser />
          <span>Profile</span>
        </Link>

        <Link 
          to="/alumni-list" 
          className={`sidebar-item ${location.pathname === '/alumni-list' ? 'active' : ''}`}
        >
          <FaUsers />
          <span>Alumni List</span>
        </Link>

        <Link 
          to="/faculties" 
          className={`sidebar-item ${location.pathname === '/faculties' ? 'active' : ''}`}
        >
          <FaChalkboardTeacher />
          <span>Faculties</span>
        </Link>

        <Link 
          to="/logout" 
          className="sidebar-item logout"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
