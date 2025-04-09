import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripInfo, getIdeas, getUserId, updateTrip } from '../data/tripInfo';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function TripHome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [unvotedCount, setUnvotedCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const getMapCenter = () => {
   // 1. If the trip itself has a location field, use that
   if (trip?.location?.latitude && trip?.location?.longitude) {
     return [trip.location.latitude, trip.location.longitude];
   }
 
   // 2. Else, compute average from ideas
   const locations = ideas
     .filter(idea => idea.location?.latitude && idea.location?.longitude)
     .map(idea => [idea.location.latitude, idea.location.longitude]);
 
   if (locations.length > 0) {
     const avgLat = locations.reduce((sum, [lat]) => sum + lat, 0) / locations.length;
     const avgLng = locations.reduce((sum, [, lng]) => sum + lng, 0) / locations.length;
     return [avgLat, avgLng];
   }
 
   // 3. Fallback to Spain if nothing else is available
   return [40.4168, -3.7038];
 };
 


  useEffect(() => {
    const userId = getUserId();

    async function fetchTripData() {
      const tripData = await getTripInfo(id);
      if (tripData) {
        setTrip(tripData);
        setImageUrl(tripData.imageUrl || '');
      }
    }

    async function fetchIdeasData() {
      const ideasData = await getIdeas(id);
      const filtered = ideasData.filter(
        (idea) =>
          !idea.archived &&
          !idea.votes?.yes?.includes(userId) &&
          !idea.votes?.no?.includes(userId)
      );
      setIdeas(ideasData);
      setUnvotedCount(filtered.length);
    }

    fetchTripData();
    fetchIdeasData();
  }, [id]);

  const handleImageUrlUpdate = async () => {
    if (!imageUrl) return;
    await updateTrip(id, { imageUrl });
    setTrip((prev) => ({ ...prev, imageUrl }));
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    if (date.toDate) return date.toDate().toLocaleDateString();
    return 'Invalid Date';
  };

  return (
    <div className="trip-home"
      style={{paddingBottom: '80px'}}>
      {/* Banner */}
      <div
        style={{
          backgroundColor: '#76B2FF',
          padding: '10px 20px',
          borderRadius: '10px',
          margin: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => navigate(`/trip/${id}/ideas`)}
      >
        <span>❗ {unvotedCount} New Ideas</span>
        <span>➡</span>
      </div>

      {/* Trip Summary */}
      {trip ? (
        <div style={{ padding: '0 20px' }}>
          <h2>{trip.tripName}</h2>
          <p>
            <strong>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</strong>
          </p>
          <p>{trip.members?.length || 1} travellers</p>

          {/* Image */}
          {trip.imageUrl ? (
            <img src={trip.imageUrl} alt="Trip" width="100%" style={{ borderRadius: '12px' }} />
          ) : (
            <p>No image uploaded.</p>
          )}
          <input
            type="text"
            placeholder="Enter Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button onClick={handleImageUrlUpdate}>Save Image URL</button>

          {/* Map Section */}
          <h3 style={{ marginTop: '20px' }}>Idea Map</h3>
          <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
          <MapContainer
  center={getMapCenter()}
  zoom={5}
  style={{ height: '100%', width: '100%' }}
>
              <TileLayer
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {ideas.map((idea) =>
                idea.location?.latitude && idea.location?.longitude ? (
                  <Marker
                    key={idea.id}
                    icon={markerIcon}
                    position={[idea.location.latitude, idea.location.longitude]}
                    eventHandlers={{
                      click: () => navigate(`/trip/${id}/ideas/${idea.id}`),
                    }}
                  >
                    <Popup>{idea.name}</Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        </div>
      ) : (
        <p>Loading trip details...</p>
      )}
    </div>
  );
}

export default TripHome;
