// Home.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { Carousel } from '../components/CardCarousel';
import { getTrips, getUserId } from '../data/tripInfo';
import { auth, db } from '../data/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

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

  const handleJoinTrip = async () => {
    setError('');
    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where('joinCode', '==', code));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Invalid code. Please try again.');
        return;
      }

      const tripDoc = snapshot.docs[0];
      const tripId = tripDoc.id;
      const user = auth.currentUser;

      // Add to trip members
      await setDoc(doc(db, 'trips', tripId, 'members', user.uid), {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: 'member',
      });

      // Add trip to user's joinedTrips
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const existingTrips = userSnap.data().joinedTrips || [];

      await updateDoc(userRef, {
        joinedTrips: [...existingTrips, tripId],
      });

      navigate(`/trip/${tripId}/home`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    }
  };

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
          <div className="join-section">
            <p>Or join a trip with a code:</p>
            <input
              type="text"
              placeholder="Enter trip code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="button" onClick={handleJoinTrip}>
              Join Trip
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
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
