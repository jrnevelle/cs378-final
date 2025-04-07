import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaLightbulb, FaCog } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const segments = location.pathname.split('/');
  const tripId = segments[2];
  const basePath = `/trip/${tripId}`;

  return (
    <div className="navbar">
      <NavLink to="/home" className="nav-button">
        <FaHome />
      </NavLink>
      <NavLink to={`${basePath}/calendar`} className="nav-button">
        <FaCalendarAlt />
      </NavLink>
      <NavLink to={`${basePath}/home`} className="nav-button">
        Trip
      </NavLink>
      <NavLink to={`${basePath}/ideas`} className="nav-button">
        <FaLightbulb />
      </NavLink>
      <NavLink to={`${basePath}/settings`} className="nav-button">
        <FaCog />
      </NavLink>
    </div>
  );
};

export default Navbar;
