import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import {
  updateDoc,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Workout } from "../../../components/types";
import { useLocalSearchParams } from "expo-router";

function ViewWorkoutScreen() {
  const [workout, setWorkout] = useState<Workout>();
  const [isMetric, setIsMetric] = useState();
  const { workoutId } = useLocalSearchParams();

  useEffect(() => {
    const fetchWorkoutFromFirestore = async () => {
      try {
        const userDoc = await getDoc(
          doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`)
        );
        const userData = userDoc.data();
        setIsMetric(userData.metricUnits);
        const workoutDoc = await getDoc(
          doc(
            FIRESTORE_DB,
            `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${workoutId}`
          )
        );
        const workoutData = workoutDoc.data();

        const exercisesCollection = collection(workoutDoc.ref, "Exercise");
        const exercisesSnapshot = await getDocs(exercisesCollection);
        const exercisesData = exercisesSnapshot.docs.map((exerciseDoc) =>
          exerciseDoc.data()
        );
        workoutData.exercises = exercisesData;
        console.log(workoutData);
        setWorkout(workoutData as Workout);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };
    fetchWorkoutFromFirestore();
  }, []);

  const renderSetInputs = (sets, exercise) => {
    return (
      <View>
        <View style={styles.setRow}>
          {!exercise.cardio && (
            <View style={styles.setRow}>
              <Text style={styles.baseText}>Reps</Text>
              <Text style={styles.baseText}>Weight</Text>
            </View>
          )}
          {exercise.cardio && <Text style={styles.baseText}>Duration</Text>}
        </View>
        {sets.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text style={styles.baseText}>{`Set ${setIndex + 1}: `}</Text>
            {!exercise.cardio && (
              <Text style={styles.baseText}>
                {set.reps.toString()} x{" "}
                {isMetric
                  ? Math.floor(set.weight_duration / 2.205).toString()
                  : Math.floor(set.weight_duration).toString()}{" "}
                {isMetric ? "kg" : "lbs"}
              </Text>
            )}
            {exercise.cardio && <Text>{set.weight_duration.toString()}</Text>}
          </View>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>{workout?.name}</Text>
        <Text>{workout?.date}</Text>
        <Text style={styles.titleText}>
          {String(Math.floor(workout?.duration / 60)).padStart(2, "0")}:
          {String(Math.floor(workout?.duration % 60)).padStart(2, "0")}
        </Text>
        <ScrollView>
          <View>
            {workout?.exercises &&
              workout.exercises.map((exercise) => (
                <View key={exercise.id}>
                  <Text style={styles.baseText}>{exercise.name}</Text>
                  {renderSetInputs(exercise.sets, exercise)}
                </View>
              ))}
          </View>
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
export default ViewWorkoutScreen;
