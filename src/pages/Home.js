// Home.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { Carousel } from '../components/CardCarousel';
import { getTrips, getUserId } from '../data/tripInfo';
import { auth } from '../data/firebaseConfig';

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tripsData = await getTrips();
        setUserId(getUserId());
        setTrips(tripsData);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleTripClick = (id) => {
    navigate(`/trip/${id}/home`);
  };

  if (loading) {
    return (
      <div className="Home">
        <p>Loading your trips...</p>
      </div>
    );
  }

  const isNewUser = trips.length === 0;

  return (
    <div className="Home">
      <Link to="/profile" className="profile">
        <img
          src={`https://www.tapback.co/api/avatar/${userId}.webp`}
          alt="Profile"
        />
      </Link>

      {isNewUser ? (
        <div className="welcome-section">
          <h2>Welcome to Vote Voyage! 🎉</h2>
          <p>You haven’t joined any trips yet.</p>
          <Link to="/plan-new-trip" className="button">
            Plan Your First Trip
          </Link>
        </div>
      ) : (
        <div className="trip-carousel">
          <h3>Current Trips</h3>
          <Carousel data={trips} onTripClick={handleTripClick} />
          <div className="action-buttons">
            <Link to="/plan-new-trip" className="button">
              Plan New Trip
            </Link>
            <Link to="/past-trips" className="button">
              View Past Trips
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
