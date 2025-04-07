import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from '../components/CardCarousel';
import { getTrips } from '../data/tripInfo';
import './Home.css';

function PastTrips() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const allTrips = await getTrips();
      const past = allTrips.filter((t) => t.status === 'past');
      setTrips(past);
    };
    fetchTrips();
  }, []);

  const handleTripClick = (id) => {
    navigate(`/trip/${id}/home`);
  };

  return (
    <div className="Home">
      <Link to="/profile" className="profile">
        <img
          src="https://www.tapback.co/api/avatar/nevelle.webp"
          alt="Profile"
        />
      </Link>
      <div className="trip-carousel">
        <h3>Past Trips</h3>
        <Carousel data={trips} onTripClick={handleTripClick} />
        <div className="action-buttons">
          <Link to="/plan-new-trip" className="button">
            Plan New Trip
          </Link>
          <Link to="/home" className="button">
            View Current Trips
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PastTrips;
