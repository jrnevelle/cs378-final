import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPlus, FaTimes } from 'react-icons/fa';
import { getTripById } from '../data/getTripById';
import './Settings.css';

function Settings() {
   const { id } = useParams();
   const trip = getTripById(id);
   const [tripName, setTripName] = useState(trip?.name || id);
  const location = useLocation();
  const basePath = location.pathname.split('/').slice(0, -1).join('/');
  const navigate = useNavigate();

  const [threshold, setThreshold] = useState(50);
  const [members, setMembers] = useState([
    { id: 1, name: "Alice Smith", email: "alice@example.com" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com" }
  ]);

  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const addMember = () => {
    const email = prompt("Enter email of new member:");
    if (!email) return;
    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const newMember = { id: Date.now(), name, email };
    setMembers([...members, newMember]);
  };

  const saveChanges = () => {
    console.log("Trip Name:", tripName);
    console.log("Threshold:", threshold);
    alert("Changes saved!");
    // Optionally persist to API or localStorage here
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-header">
        <input
          className="trip-name-input"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
        <button className="profile-icon" onClick={() => navigate(`${basePath}/profile`)}>
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
              <button className="remove-button" onClick={() => removeMember(member.id)}>
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

      <button className="save-button" onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;
