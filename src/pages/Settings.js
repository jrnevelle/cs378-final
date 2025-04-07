import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPlus, FaTimes } from 'react-icons/fa';
import { db, auth } from '../data/firebaseConfig';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import './Settings.css';

function Settings() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/').slice(0, -1).join('/');

  const [tripName, setTripName] = useState('');
  const [threshold, setThreshold] = useState(50);
  const [members, setMembers] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [creatorId, setCreatorId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      const tripRef = doc(db, 'trips', tripId);
      const tripSnap = await getDoc(tripRef);
      if (tripSnap.exists()) {
        const data = tripSnap.data();
        setTripName(data.tripName || tripId);
        setThreshold(data.votingThreshold * 100 || 50);
        setJoinCode(data.joinCode || '');
        setCreatorId(data.creatorId);
      }
    };

    const fetchMembers = async () => {
      const membersRef = collection(db, 'trips', tripId, 'members');
      const snapshot = await getDocs(membersRef);
      const memberList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(memberList);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUserId(user.uid);
    });

    fetchTrip();
    fetchMembers();

    return () => unsubscribe();
  }, [tripId]);

  const removeMember = async (memberId) => {
    await deleteDoc(doc(db, 'trips', tripId, 'members', memberId));
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const regenerateJoinCode = async () => {
    const newCode = nanoid(6).toUpperCase();
    await updateDoc(doc(db, 'trips', tripId), { joinCode: newCode });
    setJoinCode(newCode);
    alert('New join code generated!');
  };

  const addMember = async () => {
    const email = prompt('Enter email of new member:');
    if (!email) return;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert('User with that email does not exist.');
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    await setDoc(doc(db, 'trips', tripId, 'members', userId), {
      name: userData.name || email.split('@')[0],
      email,
      role: 'member',
    });

    const userRef = doc(db, 'users', userId);
    const existingTrips = userData.joinedTrips || [];

    if (!existingTrips.includes(tripId)) {
      await updateDoc(userRef, {
        joinedTrips: [...existingTrips, tripId],
      });
    }

    setMembers((prev) => [
      ...prev,
      {
        id: userId,
        name: userData.name || email.split('@')[0],
        email,
        role: 'member',
      },
    ]);
  };

  const saveChanges = async () => {
    await updateDoc(doc(db, 'trips', tripId), {
      tripName,
      votingThreshold: parseFloat(threshold) / 100,
    });
    alert('Trip settings updated!');
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-header">
        <input
          className="trip-name-input"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
        <button
          className="profile-icon"
          onClick={() => navigate(`${basePath}/profile`)}
        >
          <FaUserCircle size={32} />
        </button>
      </div>

      <div className="settings-section">
        <h3>Members Attending</h3>
        <ul className="members-list">
          {members.map((member) => (
            <li key={member.id} className="member-item">
              <div className="member-info">
                <FaUserCircle size={28} className="member-avatar" />
                <div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-email">{member.email}</div>
                </div>
              </div>
              <button
                className="remove-button"
                onClick={() => removeMember(member.id)}
              >
                <FaTimes />
              </button>
            </li>
          ))}
        </ul>
        <button className="add-button" onClick={addMember}>
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="settings-section">
        <h3>Approval Threshold</h3>
        <input
          className="threshold-input"
          type="number"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
        <span className="threshold-symbol">%</span>
      </div>

      <div className="settings-section">
        <h3>Trip Join Code</h3>
        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{joinCode}</p>
        <button
          className="button"
          onClick={() => {
            navigator.clipboard.writeText(joinCode);
            alert('Join code copied to clipboard!');
          }}
        >
          Copy Code
        </button>

        {currentUserId === creatorId && (
          <button className="button" onClick={regenerateJoinCode}>
            Regenerate Join Code
          </button>
        )}
      </div>

      <button className="save-button" onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;
