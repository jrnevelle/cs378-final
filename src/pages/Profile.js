import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    console.log('Saved profile:', profile);
    // You can add API logic or localStorage here
    alert('Changes saved!');
  };

  return (
    <div className="profile-container">
      <button className="back-button" onClick={goBack}>← Back</button>
      <h2>My Profile</h2>
      
      <div className="profile-icon">
        <FaUserCircle size={100} />
      </div>

      <div className="profile-form">
        <label>
          Name:
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </label>
        <label>
          Phone:
          <input type="tel" name="phone" value={profile.phone} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={profile.email} onChange={handleChange} />
        </label>
        <label>
          Birthday:
          <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} />
        </label>
      </div>

      <button className="save-button" onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default Profile;
