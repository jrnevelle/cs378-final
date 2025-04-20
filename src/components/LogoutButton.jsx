import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../data/firebaseConfig';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '10px 16px',
        margin: '20px auto 0',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'block',
      }}      
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
