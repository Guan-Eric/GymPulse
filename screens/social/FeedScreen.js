import React, { useEffect } from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  doc,
  query,
  getDocs,
  getDoc,
  orderBy,
} from "firebase/firestore";

function FeedScreen({ navigation }) {
  useEffect(() => {
    const fetchFeedFromFirestore = async () => {
      try {
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            name: "",
            email: FIREBASE_AUTH.currentUser.email,
            darkMode: true,
            metricUnits: false,
            bio: "",
          });

          await addDoc(
            FIRESTORE_DB,
            `Following/${FIREBASE_AUTH.currentUser.uid}`
          );
          await addDoc(
            FIRESTORE_DB,
            `Followers/${FIREBASE_AUTH.currentUser.uid}`
          );
          await addDoc(
            FIRESTORE_DB,
            `UserLikes/${FIREBASE_AUTH.currentUser.uid}`
          );
        } else {
          const userFollowingCollection = collection(
            doc(FIRESTORE_DB, `Following/${FIREBASE_AUTH.currentUser.uid}`),
            "UserFollowing"
          );
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    fetchFeedFromFirestore();
  }, []);
  return (
    <View>
      <SafeAreaView>
        <Button title="Camera" onPress={() => navigation.navigate("Camera")} />
      </SafeAreaView>
    </View>
  );
}

export default FeedScreen;
