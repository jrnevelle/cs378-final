import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const basePath = location.pathname.split('/').slice(0, -1).join('/');

    return (
        <div className="navbar">
        <Link to="cs378-final/" className="nav-button">Return to Home</Link>
        <Link to={`${basePath}/calendar`} className="nav-button">Calendar</Link>
        <Link to={`${basePath}/home`} className="nav-button">Trip Home</Link>
        <Link to={`${basePath}/settings`} className="nav-button">Settings</Link>
        <Link to={`${basePath}/ideas`} className="nav-button">Ideas</Link>
        </div>
    );
};

export default Navbar;