import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripInfo, getIdeas, getUserId, updateTrip } from '../data/tripInfo';

function TripHome() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [ideas, setIdeas] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const userId = getUserId();

    async function fetchTrip() {
      const tripData = await getTripInfo(id);
      if (tripData) {
        setTrip(tripData);
        setImageUrl(tripData.imageUrl || '');
      }
    }

    async function fetchIdeas() {
      const ideasData = await getIdeas(id);
      const filtered = ideasData.filter(
        (idea) =>
          !idea.archived &&
          !idea.votes?.yes?.includes(userId) &&
          !idea.votes?.no?.includes(userId)
      );
      setIdeas(filtered.length);
    }

    fetchTrip();
    fetchIdeas();
  }, [id]);

  async function handleImageUrlUpdate() {
    if (!imageUrl) return;

    await updateTrip(id, { imageUrl });
    setTrip((prev) => ({ ...prev, imageUrl }));
  }

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return new Date(date).toLocaleString();
    if (date.toDate) return date.toDate().toLocaleString();
    return 'Invalid Date';
  };

  return (
    <div>
      <h3>Trip Home for Trip ID: {id}</h3>

      {trip ? (
        <div>
          <h4>Trip Details</h4>
          <p>
            <strong>Start Date:</strong> {formatDate(trip.startDate)}
          </p>
          <p>
            <strong>End Date:</strong> {formatDate(trip.endDate)}
          </p>
          <p>
            <strong>Destination:</strong> {trip.destination || 'N/A'}
          </p>
          <p>
            <strong>Ideas to Vote On:</strong> {ideas}
          </p>

          {trip.imageUrl ? (
            <div>
              <h4>Trip Image</h4>
              <img src={trip.imageUrl} alt="Trip" width="200" />
            </div>
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
        </div>
      ) : (
        <p>Loading trip details...</p>
      )}
    </div>
  );
}

export default TripHome;
