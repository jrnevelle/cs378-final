import { db, auth } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function getTrips() {
  const user = auth.currentUser;
  if (!user) return [];

  // Get the user's joinedTrips list
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return [];

  const joinedTripIds = userSnap.data().joinedTrips || [];

  const trips = [];
  for (const tripId of joinedTripIds) {
    const tripRef = doc(db, 'trips', tripId);
    const tripSnap = await getDoc(tripRef);
    if (tripSnap.exists()) {
      trips.push({ id: tripId, ...tripSnap.data() });
    }
  }

  return trips;
}
