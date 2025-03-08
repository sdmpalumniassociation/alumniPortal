import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaChalkboardTeacher, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        // Remove token and user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Navigate to home page and reload
        navigate('/');
        window.location.reload();
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-nav-toggle')) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <div className="navbar-container">
            {/* Mobile Menu Toggle */}
            <button className="mobile-nav-toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            {/* Overlay for mobile */}
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}></div>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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

                <button
                    onClick={handleLogout}
                    className="sidebar-item logout"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default NavBar;
