import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTripInfo, getIdeas, addIdea, updateTrip } from "../data/tripInfo";
import { GeoPoint, Timestamp } from "firebase/firestore";

function TripHome() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [ideas, setIdeas] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchTrip() {
      const tripData = await getTripInfo(id);
      if (tripData) {
        setTrip(tripData);
        setImageUrl(tripData.imageUrl || "");
      }
    }

    async function fetchIdeas() {
      const ideasData = await getIdeas(id);
      setIdeas(ideasData.length);
    }

    fetchTrip();
    fetchIdeas();
  }, [id]);

  async function handleImageUrlUpdate() {
    if (!imageUrl) return;

    await updateTrip(id, { imageUrl });
    setTrip(prev => ({ ...prev, imageUrl }));
  }

  return (
    <div>
      <h3>Trip Home for Trip ID: {id}</h3>

      {trip ? (
        <div>
          <h4>Trip Details</h4>
          <p><strong>Start Date:</strong> {trip.start.toDate().toLocaleString()}</p>
          <p><strong>End Date:</strong> {trip.end.toDate().toLocaleString()}</p>
          <p><strong>Members:</strong> {trip.members?.join(", ")}</p>
          <p><strong>Ideas:</strong> {ideas}</p>
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
