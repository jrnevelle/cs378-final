import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { auth, db } from '../data/firebaseConfig'; // ✅ correct filename + path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import LogoutButton from '../components/LogoutButton.jsx';

import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const goBack = () => navigate(-1);
  const [uid, setUid] = useState("");

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile((prev) => ({
          ...prev,
          ...docSnap.data(),
        }));
      }
    };
    fetchProfile();
    console.log(user.uid);
  }, [user]);

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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="profile-back-button" onClick={goBack}>
          <FaArrowLeft size="24" />
        </button>
        <h2 className='profile-title'>My Profile</h2>
      </div>

      <div className="profile-profile-icon">
        <img src={`https://www.tapback.co/api/avatar/${user.uid}.webp`}>
        </img>
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
      <LogoutButton className="logout-button"/>
    </div>
  );
}

export default Profile;
