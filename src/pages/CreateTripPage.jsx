import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../data/firebaseConfig';
import { collection, doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import './CreateTripPage.css';
import { FiArrowLeft } from 'react-icons/fi';

const CreateTripPage = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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

    const finalImage =
      imageUrl ||
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';

    await setDoc(doc(db, 'trips', tripId), {
      tripName,
      votingThreshold: 0.5,
      creatorId: user.uid,
      joinCode,
      status: 'upcoming',
      coverPhoto: finalImage,
      imageUrl: finalImage,
      destination,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: Timestamp.fromDate(new Date(endDate)),
    });

    await setDoc(doc(db, 'trips', tripId, 'members', user.uid), {
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      role: 'admin',
    });

    await setDoc(
      doc(db, 'users', user.uid),
      { joinedTrips: [tripId] },
      { merge: true }
    );

    navigator.clipboard.writeText(joinCode);
    alert(`Trip created! Join code copied: ${joinCode}`);

    navigate(`/trip/${tripId}/home`);
  };

  const handleBack = async () => {
    const user = auth.currentUser;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const hasTrips =
      userDoc.exists() && (userDoc.data().joinedTrips || []).length > 0;

    navigate(hasTrips ? '/home' : '/welcome');
  };

  return (
    <div className="create-trip-container">
      <button className="profile-back-button" onClick={handleBack}>
        <FiArrowLeft size="40" />
      </button>

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
      <input
        type="url"
        placeholder="Cover Photo URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={handleCreateTrip} disabled={creating}>
        {creating ? 'Creating...' : 'Create Trip'}
      </button>
    </div>
  );
};

export default CreateTripPage;
