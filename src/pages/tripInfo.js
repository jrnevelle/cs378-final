// tripInfo.js (clean version)
import { auth, db } from '../data/firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

export async function getTripInfo(tripId) {
  const tripRef = doc(db, 'trips', tripId);
  const tripSnap = await getDoc(tripRef);
  return tripSnap.exists() ? tripSnap.data() : null;
}

export async function updateTrip(tripId, updates) {
  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, updates);
}

export async function addIdea(tripId, ideaData) {
  const ideasRef = collection(db, `trips/${tripId}/ideas`);
  await addDoc(ideasRef, ideaData);
}

export async function getIdeas(tripId) {
  const ideasCollection = collection(db, `trips/${tripId}/ideas`);
  const ideaDocs = await getDocs(ideasCollection);
  return ideaDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getTrips() {
  const user = auth.currentUser;
  if (!user) return [];

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return [];

  const joinedTripIds = userSnap.data().joinedTrips || [];
  const trips = [];

  for (const tripId of joinedTripIds) {
    const tripDoc = await getDoc(doc(db, 'trips', tripId));
    if (tripDoc.exists()) {
      trips.push({ id: tripId, ...tripDoc.data() });
    }
  }

  return trips;
}
