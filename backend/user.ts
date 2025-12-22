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
  updateDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { User } from "../components/types";
import axios from "axios";

export async function addUser(
  username: string,
  name: string,
  primaryHeight: string,
  secondaryHeight: string,
  weight: string,
  heightIsMetric: string,
  weightIsMetric: string
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
      heightMetricUnits: heightIsMetric == "true",
      weightMetricUnits: weightIsMetric == "true",
      primaryHeight: parseFloat(primaryHeight as string),
      secondaryHeight: parseFloat(secondaryHeight as string),
      weight: parseFloat(weight as string),
      bio: "",
      id: FIREBASE_AUTH.currentUser.uid,
      prefixes: generatePrefixes(username),
      username: username,
      url: "https://firebasestorage.googleapis.com/v0/b/fitai-2e02d.appspot.com/o/profile%2Fprofile.png?alt=media&token=89a32c06-e6df-4bfa-abe9-b9ebf463582a",
      currentStreak: 0,
      longestStreak: 0,
      streakResetDate: null,
      showStreak: false,
      showWorkout: false,
      showTermsCondition: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function updateUsername(username: string) {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      username: username,
      prefixes: generatePrefixes(username),
    });
  } catch (error) {
    console.error("Error updating username", error);
  }
}
function generatePrefixes(username: string) {
  const prefixes = [];
  for (let i = 1; i <= username.length; i++) {
    prefixes.push(username.substring(0, i).toLowerCase());
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

export async function addNotification(
  userId: string,
  type: string,
  postId: string
) {
  try {
    const notificationsCollectionRef = collection(
      FIRESTORE_DB,
      `Users/${userId}/Notifications`
    );
    const currentDate = new Date();

    const notificationDocRef = await addDoc(notificationsCollectionRef, {
      userId: FIREBASE_AUTH.currentUser.uid,
      type: type,
      date: currentDate,
      postId: postId,
    });
    updateDoc(notificationDocRef, { id: notificationDocRef.id });
    pushNotifications(userId, type);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

export async function getNotifications() {
  try {
    const notificationsRef = collection(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Notifications`
    );
    const q = query(notificationsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const notificationsList = await Promise.all(
      snapshot.docs.map(async (doc) => ({
        id: doc.id,
        username: (await getUser(doc.data().userId)).username,
        date: doc.data().date.toDate() as string,
        userId: doc.data().userId as string,
        type: doc.data().type as string,
        postId: doc.data().postId as string,
      }))
    );
    return notificationsList;
  } catch (error) {
    console.error("Error fetching notification:", error);
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

export async function savePushToken(token: string) {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const tokens = data.tokens ?? [];

      if (!tokens.includes(token)) {
        tokens.push(token);
        await updateDoc(userDocRef, { tokens: tokens });
      }
    }
  } catch (error) {
    console.error("Error saving push token:", error);
  }
}

async function getUserPushTokens(userId: string) {
  const docRef = doc(FIRESTORE_DB, `Users/${userId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.tokens ?? [];
  } else {
    return [];
  }
}

function getNotificationMessage(type: string): string {
  return type === "like"
    ? " gave you props for your workout."
    : type === "comment"
    ? " commented on your workout."
    : type === "accepted"
    ? " accepted your follow request."
    : type === "request"
    ? " requested to follow you."
    : " has a new post.";
}

async function pushNotifications(userId: string, type: string) {
  const tokens = await getUserPushTokens(userId);

  if (tokens.length > 0) {
    await Promise.all(
      tokens.map(async (token) =>
        axios.post("http://192.168.2.44:8000/sendPushNotification", {
          token,
          body:
            (await getUser(FIREBASE_AUTH.currentUser.uid)).username +
            getNotificationMessage(type),
        })
      )
    );
  }
}

export async function updateUserAvatar(url: string) {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    updateDoc(userDocRef, { url: url });
  } catch (error) {
    console.error("Error updating user avatar:", error);
  }
}

export async function updateTermsCondition(): Promise<void> {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      showTermsCondition: false,
    });
  } catch (error) {
    console.error("Error saving Terms and Condition:", error);
  }
}

export async function deleteAccount() {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}
