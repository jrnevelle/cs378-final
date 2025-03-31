import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { Carousel } from "../components/CardCarousel";
import allTrips from "../data/allTrips.json";

function PastTrips() {
  const trips = allTrips.trips;
  const navigate = useNavigate();

  const handleTripClick = (id) => {
    navigate(`/trip/${id}/home`);
  };

  return (
    <div className="Home">
      <Link to="/profile" className="profile">
        <img src="https://www.tapback.co/api/avatar/nevelle.webp" alt="Profile" />
      </Link>
      <div className="trip-carousel">
        <h3>Past Trips</h3>
        <Carousel data={trips} onTripClick={handleTripClick} />
        <div className="action-buttons">
          <Link to="/plan-new-trip" className="button">Plan New Trip</Link>
          <Link to="/cs378-final" className="button">View Current Trips</Link>
        </div>
      </div>
    </div>
  );
}

export default PastTrips;
