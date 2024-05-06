import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

export async function addUser() {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await setDoc(userDocRef, {
      name: "",
      email: FIREBASE_AUTH.currentUser.email,
      darkMode: true,
      metricUnits: false,
      bio: "",
      id: FIREBASE_AUTH.currentUser.uid,
    });
  } catch {}
}
