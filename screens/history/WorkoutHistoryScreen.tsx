import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Button,
  Appearance,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { FIRESTORE_DB } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

function WorkoutHistoryScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchWorkoutsFromFirestore = async () => {
      try {
        setUserId(FIREBASE_AUTH.currentUser.uid);
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );

        const workoutsCollectionRef = collection(userDocRef, "Workouts");

        const unsubscribe = onSnapshot(workoutsCollectionRef, (snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setWorkouts(data);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching workouts from Firestore:", error);
      }
    };

    fetchWorkoutsFromFirestore();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>Your Workouts</Text>
        <ScrollView>
          {workouts.length == 0 ? (
            <Text>No workouts found. Start a workout!</Text>
          ) : (
            workouts.map((item) => (
              <Pressable
                key={item.name}
                onPress={() =>
                  navigation.navigate("ViewWorkout", {
                    workoutId: item.id,
                    userId: userId,
                  })
                }
              >
                <Text style={styles.titleText}>{item.name}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
export default WorkoutHistoryScreen;