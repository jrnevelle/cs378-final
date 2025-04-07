import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../data/firebaseConfig';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import './CreateTripPage.css';

const CreateTripPage = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateTrip = async () => {
    if (!tripName || !destination || !startDate || !endDate) {
      return alert('Please fill in all fields before creating the trip.');
    }

    setCreating(true);
    const user = auth.currentUser;
    const tripId = nanoid(12);
    const joinCode = nanoid(6).toUpperCase();

    const tripRef = doc(db, 'trips', tripId);

    // ✅ 1. Create the trip doc with full metadata
   await setDoc(tripRef, {
     tripName,
     votingThreshold: 0.5,
     creatorId: user.uid,
     joinCode,
     status: 'upcoming',
     coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Default image
     destination,
     startDate: Timestamp.fromDate(new Date(startDate)),
     endDate: Timestamp.fromDate(new Date(endDate)),
     imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Also for display
   });
   
    // ✅ 2. Add creator to members subcollection
    await setDoc(doc(db, 'trips', tripId, 'members', user.uid), {
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      role: 'admin',
    });

    // ✅ 3. Add trip ID to user's joinedTrips
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { joinedTrips: [tripId] }, { merge: true });

    // ✅ 4. Copy join code to clipboard
    navigator.clipboard.writeText(joinCode);
    alert(`Trip created! Join code copied: ${joinCode}`);

    // ✅ 5. Redirect to trip home
    navigate(`/trip/${tripId}/home`);
  };

  return (
    <div className="create-trip-container">
      <h2>Create a New Trip</h2>
      <input
        type="text"
        placeholder="Trip Name"
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={handleCreateTrip} disabled={creating}>
        {creating ? 'Creating...' : 'Create Trip'}
      </button>
    </div>
  );
};

export default CreateTripPage;
