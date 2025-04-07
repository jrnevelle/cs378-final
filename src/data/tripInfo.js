import { db, auth } from "./firebaseConfig";
import { getFirestore, doc, getDoc, addDoc, updateDoc, collection, getDocs } from "firebase/firestore";

async function getTripInfo(tripId) {
    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
        return tripSnap.data();
    } else {
        console.log("No such trip found!");
        return null;
    }
}

async function updateTrip(tripId, updates) {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, updates);
}

async function addIdea(tripId, ideaData) {
    const ideasRef = collection(db, `trips/${tripId}/ideas`);
    await addDoc(ideasRef, ideaData);
}

async function getTrips() {
    const tripsCollection = collection(db, "trips");
    const tripDocs = await getDocs(tripsCollection);
    const trips = tripDocs.docs.map((doc, index) => ({
        id: doc.id,
        index: index,
        ...doc.data()
    }));
    return trips;
}

function getUserId() {
    const user = auth.currentUser;
    const uid = user.uid;
    return uid;
}

async function getIdeas(id) {
    const ideasCollection = collection(db, `trips/${id}/ideas`);
    const ideaDocs = await getDocs(ideasCollection);

    const ideas = ideaDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    return ideas;
}

export async function getIdeaById(tripId, ideaId) {
    console.log(ideaId);
    const docRef = doc(db, "trips", tripId, "ideas", ideaId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}
  
export async function updateIdeaVotes(tripId, ideaId, votes) {
    const docRef = doc(db, "trips", tripId, "ideas", ideaId);
    await updateDoc(docRef, { votes });
}

export { getTripInfo, updateTrip, addIdea, getIdeas, getTrips, getUserId };