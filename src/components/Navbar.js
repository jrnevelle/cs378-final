import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiMap, FiSettings } from 'react-icons/fi';
import { FaRegLightbulb } from 'react-icons/fa';
import './Navbar.css';
import { getTripInfo } from '../data/tripInfo';

const Navbar = () => {
  const location = useLocation();
  const segments = location.pathname.split('/');
  const tripId = segments[2];
  const basePath = `/trip/${tripId}`;
  const [name, setName] = useState("Trip");

  useEffect(() => {
    const fetchTripName = async () => {
      const tripInfo = await getTripInfo(tripId);
      setName(tripInfo?.tripName || "Trip");
    };
    fetchTripName();
  }, [tripId]);

  return (
    <div className="navbar">
      <NavLink to="/home" className="nav-button">
        {({ isActive }) => (
          <div className="nav-item">
            <FiHome className={`nav-icon ${isActive ? 'active' : ''}`} />
            <div className={`nav-label ${isActive ? 'active' : ''}`}>All Trips</div>
            {isActive && <div className="active-bar" />}
          </div>
        )}
      </NavLink>

      <NavLink to={`${basePath}/calendar`} className="nav-button">
        {({ isActive }) => (
          <div className="nav-item">
            <FiCalendar className={`nav-icon ${isActive ? 'active' : ''}`} />
            <div className={`nav-label ${isActive ? 'active' : ''}`}>Calendar</div>
            {isActive && <div className="active-bar" />}
          </div>
        )}
      </NavLink>

      <NavLink to={`${basePath}/home`} className="nav-button">
        {({ isActive }) => (
          <div className="nav-item">
            <FiMap className={`nav-icon ${isActive ? 'active' : ''}`} />
            <div className={`nav-label ${isActive ? 'active' : ''}`}>Trip Home</div>
            {isActive && <div className="active-bar" />}
          </div>
        )}
      </NavLink>

      <NavLink to={`${basePath}/ideas`} className="nav-button">
        {({ isActive }) => (
          <div className="nav-item">
            <FaRegLightbulb className={`nav-icon ${isActive ? 'active' : ''}`} />
            <div className={`nav-label ${isActive ? 'active' : ''}`}>Ideas</div>
            {isActive && <div className="active-bar" />}
          </div>
        )}
      </NavLink>

      <NavLink to={`${basePath}/settings`} className="nav-button">
        {({ isActive }) => (
          <div className="nav-item">
            <FiSettings className={`nav-icon ${isActive ? 'active' : ''}`} />
            <div className={`nav-label ${isActive ? 'active' : ''}`}>Settings</div>
            {isActive && <div className="active-bar" />}
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default Navbar;
