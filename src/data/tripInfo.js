// /data/tripInfo.js
import { auth, db } from './firebaseConfig';
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

// Get current user's UID
export function getUserId() {
  const user = auth.currentUser;
  return user?.uid;
}

// Get trip info by tripId
export async function getTripInfo(tripId) {
  const tripRef = doc(db, 'trips', tripId);
  const tripSnap = await getDoc(tripRef);
  return tripSnap.exists() ? tripSnap.data() : null;
}

// Update a trip's fields
export async function updateTrip(tripId, updates) {
  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, updates);
}

// Add a new idea to a trip
export async function addIdea(tripId, ideaData) {
  const ideasRef = collection(db, `trips/${tripId}/ideas`);
  await addDoc(ideasRef, ideaData);
}

// Get all ideas for a trip
export async function getIdeas(tripId) {
  const ideasCollection = collection(db, `trips/${tripId}/ideas`);
  const ideaDocs = await getDocs(ideasCollection);
  return ideaDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get a single idea by tripId and ideaId
export async function getIdeaById(tripId, ideaId) {
  const docRef = doc(db, 'trips', tripId, 'ideas', ideaId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

// Update votes for an idea
export async function updateIdeaVotes(tripId, ideaId, votes) {
  const docRef = doc(db, 'trips', tripId, 'ideas', ideaId);
  await updateDoc(docRef, { votes });
}

// Get all trips the current user is part of (from joinedTrips array)
export async function getTrips() {
  const user = auth.currentUser;
  if (!user) return [];

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return [];

  const joinedTripIds = userSnap.data().joinedTrips || [];
  const trips = [];

  for (const tripId of joinedTripIds) {
    const tripSnap = await getDoc(doc(db, 'trips', tripId));
    if (tripSnap.exists()) {
      trips.push({ id: tripId, ...tripSnap.data() });
    }
  }

  return trips;
}

// Get a specific member document by tripId and userId
export async function getTripMemberById(tripId, userId) {
    const memberRef = doc(db, 'trips', tripId, 'members', userId);
    const memberSnap = await getDoc(memberRef);
    return memberSnap.exists() ? { id: memberSnap.id, ...memberSnap.data() } : null;
  }