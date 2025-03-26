import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };


  return (
    <div>
      <h3>Profile</h3>
      <button onClick={goBack}>Back</button>
    </div>
  );
}

export default Profile;
