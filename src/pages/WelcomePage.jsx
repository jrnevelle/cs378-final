import React, { useState } from 'react';
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

const WelcomePage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className="welcome-container">
      <h2>Welcome to Vote Voyage! 🎉</h2>
      <p>You haven’t joined any trips yet.</p>

      <Link to="/plan-new-trip" className="button">
        Plan a New Trip
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
  );
};

export default WelcomePage;
