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
import { updateTrip } from '../data/tripInfo';

function Settings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const basePath = location.pathname.split('/').slice(0, -1).join('/');

  const [tripName, setTripName] = useState('');
  const [threshold, setThreshold] = useState(50);
  const [members, setMembers] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [creatorId, setCreatorId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      const tripRef = doc(db, 'trips', id);
      const tripSnap = await getDoc(tripRef);
      if (tripSnap.exists()) {
        const data = tripSnap.data();
        setTripName(data.tripName || id);
        setThreshold(data.votingThreshold * 100 || 50);
        setJoinCode(data.joinCode || '');
        setCreatorId(data.creatorId);
        setTrip(data);
      }
    };

    const fetchMembers = async () => {
      const membersRef = collection(db, 'trips', id, 'members');
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
  }, [id]);

  const removeMember = async (memberId) => {
    await deleteDoc(doc(db, 'trips', id, 'members', memberId));
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const regenerateJoinCode = async () => {
    const newCode = nanoid(6).toUpperCase();
    await updateDoc(doc(db, 'trips', id), { joinCode: newCode });
    setJoinCode(newCode);
    alert('New join code generated!');
  };

  const handleImageUrlUpdate = async () => {
    if (!imageUrl) return;
    await updateTrip(id, { imageUrl });
    setTrip((prev) => ({ ...prev, imageUrl }));
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

    await setDoc(doc(db, 'trips', id, 'members', userId), {
      name: userData.name || email.split('@')[0],
      email,
      role: 'member',
    });

    const userRef = doc(db, 'users', userId);
    const existingTrips = userData.joinedTrips || [];

    if (!existingTrips.includes(id)) {
      await updateDoc(userRef, {
        joinedTrips: [...existingTrips, id],
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
    const newThreshold = parseFloat(threshold) / 100;

    await updateDoc(doc(db, 'trips', id), {
      tripName,
      votingThreshold: newThreshold,
    });

    // Fetch all ideas for this trip
    const ideasRef = collection(db, 'trips', id, 'ideas');
    const snapshot = await getDocs(ideasRef);

    snapshot.forEach(async (docSnap) => {
      const idea = docSnap.data();
      const yes = idea.votes?.yes?.length || 0;
      const no = idea.votes?.no?.length || 0;
      const total = yes + no;
      const percentage = total > 0 ? yes / total : 0;

      // Archive if below new threshold
      const shouldArchive = percentage < newThreshold;
      if (idea.archived !== shouldArchive) {
        await updateDoc(doc(db, 'trips', id, 'ideas', docSnap.id), {
          archived: shouldArchive,
        });
      }
    });

    alert('Trip settings updated and ideas re-evaluated!');
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-header">
        <input
          className="trip-name-input"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
        {currentUserId && (
          <button
            className="profile-icon"
            onClick={() => navigate(`${basePath}/profile`)}
            style={{ padding: 0, border: 'none', background: 'none' }}
          >
            <img
              src={`https://www.tapback.co/api/avatar/${currentUserId}.webp`}
              alt="Profile Avatar"
              style={{
                height: '62px',
                width: '62px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginLeft: '15px',
                marginRight: '-5px',
              }}
            />
          </button>
        )}
      </div>

      {trip && trip.imageUrl ? (
        <img
          src={trip.imageUrl}
          alt="Trip"
          width="100%"
          style={{ borderRadius: '12px' }}
        />
      ) : (
        <p>No image uploaded.</p>
      )}

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

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'center',
          }}
        >
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
      </div>

      <button className="save-button" onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;
