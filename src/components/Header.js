import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/sdmp-logo.png';


const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // Remove token and user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
    };

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
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="header-link logout-button"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "header-link login-link active" : "header-link login-link"
                            }
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
