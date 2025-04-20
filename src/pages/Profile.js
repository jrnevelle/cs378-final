
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { auth, db } from '../data/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import LogoutButton from '../components/LogoutButton.jsx';
import logo from '../assets/vote_voyage_logo.png'; // adjust path if needed
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, profile);
    alert('Profile updated!');
  };

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <button className="back-button" onClick={goBack}>
        ← Back
      </button>
      <img
        src={logo}
        alt="Vote Voyage Logo"
        style={{ width: '80px', height: '80px' }}
      />

      <h2>My Profile</h2>

      <div className="profile-icon">
        <img
          src={`https://www.tapback.co/api/avatar/${user.uid}.webp`}
          alt="Profile Avatar"
        />
      </div>

      <div className="profile-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={profile.phone || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
            disabled
          />
        </label>
        <label>
          Birthday:
          <input
            type="date"
            name="birthday"
            value={profile.birthday || ''}
            onChange={handleChange}
          />
        </label>
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
      <LogoutButton />
    </div>
  );
}

export default Profile;

