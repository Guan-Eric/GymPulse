import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { Post, User } from "../components/types";

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
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function getUser(userId: string): Promise<User> {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.data() as User;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

export async function getUserFollowing(userId: string): Promise<boolean> {
  const followingDocRef = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Following/${userId}`
  );
  const followingSnapshot = await getDoc(followingDocRef);
  return followingSnapshot.exists();
}

export async function toggleFollow(
  userId: string,
  following: boolean
): Promise<boolean> {
  try {
    const followingDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Following/${userId}`
    );
    if (following) {
      await deleteDoc(followingDocRef);
    } else {
      await setDoc(followingDocRef, {});
    }
    return !following;
  } catch (error) {
    console.error("Error toggling like:", error);
    return !following;
  }
}
