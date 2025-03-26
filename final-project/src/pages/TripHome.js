import React from 'react';
import { useParams } from 'react-router-dom';


function TripHome() {
    const { id } = useParams();

    return (
      <div>
        <h3>Trip Home for Trip ID: {id}</h3>
      </div>  
    );
}

export default TripHome;