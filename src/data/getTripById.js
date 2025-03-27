import tripData from './allTrips.json'; // adjust path if needed

export function getTripById(id) {
  return tripData.trips.find((trip) => trip.id === parseInt(id));
}
