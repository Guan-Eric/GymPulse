import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_STR, FIRESTORE_DB } from "../firebaseConfig";
import { Post, User } from "../components/types";

export async function addUser(
  username: string,
  name: string,
  height: string,
  weight: string,
  isMetric: string
) {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await setDoc(userDocRef, {
      name: name,
      email: FIREBASE_AUTH.currentUser.email,
      darkMode: true,
      metricUnits: isMetric == "true",
      height: height as unknown as number,
      weight: weight as unknown as number,
      bio: "",
      id: FIREBASE_AUTH.currentUser.uid,
      prefixes: generatePrefixes(username),
      username: username,
      url: "https://firebasestorage.googleapis.com/v0/b/fitai-2e02d.appspot.com/o/profile%2Fprofile.png?alt=media&token=89a32c06-e6df-4bfa-abe9-b9ebf463582a",
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

function generatePrefixes(username) {
  const prefixes = [];
  for (let i = 1; i <= username.length; i++) {
    prefixes.push(username.substring(0, i).toLowerCase());
    console.log(prefixes);
  }
  return prefixes;
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
    const followerDocRef = doc(
      FIRESTORE_DB,
      `Users/${userId}/Followers/${FIREBASE_AUTH.currentUser.uid}`
    );
    if (following) {
      await deleteDoc(followingDocRef);
      await deleteDoc(followerDocRef);
    } else {
      await setDoc(followingDocRef, {});
      await setDoc(followerDocRef, {});
    }
    return !following;
  } catch (error) {
    console.error("Error toggling like:", error);
    return !following;
  }
}

export async function sendFollowRequest(userId: string) {
  try {
    const followRequestsDocRef = doc(
      FIRESTORE_DB,
      `Users/${userId}/FollowRequests/${FIREBASE_AUTH.currentUser.uid}`
    );
    await setDoc(followRequestsDocRef, { status: "pending" });

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dateDay = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${dateDay} ${hours}:${minutes}`;

    const notificationsCollection = collection(
      FIRESTORE_DB,
      `Users/${userId}/Notifications/`
    );
    await addDoc(notificationsCollection, {
      type: "followRequest",
      timestamp: formattedDateTime,
    });
  } catch (error) {
    console.error("Error sending follow request:", error);
  }
}

export async function handleFollowRequest(
  userId: string,
  notificationId: string,
  accepted: boolean
) {
  try {
    const followRequestsDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/FollowRequests/${userId}`
    );
    const notificationDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Notifications/${notificationId}`
    );
    deleteDoc(notificationDocRef);
    deleteDoc(followRequestsDocRef);

    if (accepted) {
    }
  } catch (error) {
    console.error("Error handling follow request:", error);
  }
}

export async function isUsernameExists(username: string): Promise<boolean> {
  try {
    const userCollection = collection(FIRESTORE_DB, "Users");
    const userQuery = query(userCollection, where("username", "==", username));
    const userSnapshot = getDocs(userQuery);

    return !(await userSnapshot).empty;
  } catch (error) {
    console.error("Error checking username:", error);
  }
}
