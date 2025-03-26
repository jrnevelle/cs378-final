import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

function Settings() {
    const { id } = useParams();
    const location = useLocation();
    const basePath = location.pathname.split('/').slice(0, -1).join('/');

  return (
    <div>
      <h3>Settings for Trip ID: {id}</h3>
      <Link to={`${basePath}/profile`}>Profile</Link>
    </div>
  );
}

export default Settings;
