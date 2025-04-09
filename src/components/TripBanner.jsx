import React, { useEffect, useState } from 'react';
import './TripBanner.css';
import { getTripInfo } from '../data/tripInfo';
import { useParams, useNavigate } from 'react-router-dom';

function TripBanner({id: id}) {
  const [tripData, setTripData] = useState(null);
//   const {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      const info = await getTripInfo(id);
      setTripData(info);
    }
    fetchData();
  }, []);

  if (!tripData) return null; // or a loading spinner

  return (
    <div className="trip-banner">
      <img src={tripData.imageUrl} alt="Trip" className="trip-banner-image" />
      <div className="trip-banner-overlay">
        <h1 className="trip-banner-title">{tripData.tripName}</h1>
      </div>
    </div>
  );
}

export default TripBanner;
