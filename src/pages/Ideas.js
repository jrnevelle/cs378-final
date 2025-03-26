import React from 'react';
import { useParams } from 'react-router-dom';

function Ideas() {
  const { id } = useParams();

  return (
    <div>
      <h3>Ideas for Trip ID: {id}</h3>
    </div>
  );
}

export default Ideas;
