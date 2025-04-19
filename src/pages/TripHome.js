import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTripInfo,
  getIdeas,
  getUserId,
  getTripMembers,
} from '../data/tripInfo';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import TripBanner from '../components/TripBanner';
import { FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import './TripHome.css';

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
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const userId = getUserId();

    async function fetchTripData() {
      const tripData = await getTripInfo(id);
      if (tripData) setTrip(tripData);
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

    async function fetchMembers() {
      const memberData = await getTripMembers(id);
      setMembers(memberData);
    }

    fetchTripData();
    fetchIdeasData();
    fetchMembers();
  }, [id]);

  const getMapCenter = () => {
    if (trip?.location?.latitude && trip?.location?.longitude) {
      return [trip.location.latitude, trip.location.longitude];
    }

    const locations = ideas
      .filter((idea) => idea.location?.latitude && idea.location?.longitude)
      .map((idea) => [idea.location.latitude, idea.location.longitude]);

    if (locations.length > 0) {
      const avgLat = locations.reduce((sum, [lat]) => sum + lat, 0) / locations.length;
      const avgLng = locations.reduce((sum, [, lng]) => sum + lng, 0) / locations.length;
      return [avgLat, avgLng];
    }

    return [40.4168, -3.7038]; // Default to Madrid
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    if (date.toDate) return date.toDate().toLocaleDateString();
    return 'Invalid Date';
  };

  return (
    <div className="trip-home">
      <TripBanner id={id} />

      <div className="trip-home-alert-box" onClick={() => navigate(`/trip/${id}/ideas`)}>
        <span><FiAlertTriangle /> {unvotedCount} New Ideas</span>
        <FiArrowRight />
      </div>

      {trip ? (
        <div className="trip-home-info">
          <p className="trip-home-dates">
            <strong>{trip.startDate.toDate().toDateString()} - {trip.endDate.toDate().toDateString()}</strong>
          </p>

          {members.length > 0 && (
            <div className="trip-home-voters">
              <div className="trip-home-avatars">
                {members.map((member, idx) => (
                  <img
                    key={idx}
                    src={`https://www.tapback.co/api/avatar/${member.id}.webp`}
                    className="trip-home-avatar"
                    alt={member.name || "traveller"}
                  />
                ))}
              </div>
              <span>{members.length} Travellers</span>
            </div>
          )}

          <div className="trip-home-map-wrapper">
            <MapContainer center={getMapCenter()} zoom={5} className="trip-home-map-container">
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
