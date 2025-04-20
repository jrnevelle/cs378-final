import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { auth, db } from '../data/firebaseConfig';
import './WelcomePage.css';
import logo from '../assets/vote_voyage_logo.png';

const WelcomePage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
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

      await setDoc(doc(db, 'trips', tripId, 'members', user.uid), {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: 'member',
      });

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

  return (
    <div className="welcome-container">
      <div className="top-bar">
        <img src={logo} alt="Vote Voyage Logo" className="welcome-logo" />
        <Link to="/profile" className="profile-icon">
          {userId && (
            <img
              src={`https://www.tapback.co/api/avatar/${userId}.webp`}
              alt="Profile"
            />
          )}
        </Link>
      </div>

      <div className="hero">
        <div className="hero-text">
          <h1>
            Welcome to <span>Vote Voyage</span> ✈️
          </h1>
          <p>
            Collaboratively plan trips with friends. Add ideas, vote on
            activities, and build an itinerary together!
          </p>
          <Link to="/plan-new-trip" className="button">
            Plan a New Trip
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1502920917128-1aa500764b8e"
          alt="Travel"
          className="hero-image"
        />
      </div>

   

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
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default WelcomePage;
