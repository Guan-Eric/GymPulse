import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Day } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

function WorkoutScreen() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const dateDay = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${dateDay} ${hours}:${minutes}`;
  const [day, setDay] = useState<Day>();
  const [isDirty, setIsDirty] = useState(false);
  const [isMetric, setIsMetric] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const { userId, planId, dayId } = useLocalSearchParams();

  const startStopwatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setRunning(true);
  };

  const fetchDayFromFirestore = async () => {
    try {
      const userDoc = await getDoc(
        doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`)
      );
      setIsMetric(userDoc.data().metricUnits);
      const dayDoc = await getDoc(
        doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Days/${dayId}`
        )
      );
      const dayData = dayDoc.data();
      const exercisesCollection = collection(dayDoc.ref, "Exercise");
      const exercisesSnapshot = await getDocs(exercisesCollection);
      const exercisesData = exercisesSnapshot.docs.map((exerciseDoc) =>
        exerciseDoc.data()
      );
      dayData.exercises = exercisesData;
      setDay(dayData as Day);
    } catch (error) {
      console.error("Error fetching day data:", error);
    }
  };

  useEffect(() => {
    if (isDirty) {
      handleSaveDay();
      setIsDirty(false);
    }
  }, [day, isDirty]);

  useFocusEffect(
    useCallback(() => {
      fetchDayFromFirestore();
    }, [])
  );

  useEffect(() => {
    fetchDayFromFirestore();
    startStopwatch();
  }, []);
  const setNameAndSave = (newName) => {
    setDay({ ...day, name: newName });
    setIsDirty(true);
  };
  const handleSaveDay = async () => {
    const dayDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Days/${dayId}`
    );
    updateDoc(dayDocRef, { name: day.name });

    for (const exercise of day.exercises) {
      const exerciseDocRef = doc(dayDocRef, `Exercise/${exercise.id}`);
      await updateDoc(exerciseDocRef, {
        name: exercise.name,
        sets: exercise.sets,
      });
    }
  };

  const handleAddSet = async (dayId, exerciseId) => {
    try {
      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
      );
      const exerciseDocSnap = await getDoc(exerciseDocRef);

      if (exerciseDocSnap.exists()) {
        const currentSets = exerciseDocSnap.data().sets || [];
        const newSets = [...currentSets, { reps: 0, weight_duration: 0 }];
        await updateDoc(exerciseDocRef, { sets: newSets });

        const updatedExercises = day.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, sets: newSets } : ex
        );
        setDay({ ...day, exercises: updatedExercises });
        setIsDirty(true);
      }
    } catch (error) {
      console.error("Error adding set:", error);
    }
  };

  const handleDeleteExercise = async (dayId: string, exerciseId: string) => {
    try {
      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
      );
      await deleteDoc(exerciseDocRef);

      const updatedExercises = day.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      );
      setDay({ ...day, exercises: updatedExercises });
      setIsDirty(true);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const handleDeleteSet = async (
    dayId: string,
    exerciseId: string,
    setIndex: number
  ) => {
    try {
      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
      );
      const exerciseDocSnap = await getDoc(exerciseDocRef);

      if (exerciseDocSnap.exists()) {
        const currentSets = exerciseDocSnap.data().sets || [];
        const newSets = currentSets.filter((set, index) => index !== setIndex);
        await updateDoc(exerciseDocRef, { sets: newSets });

        const updatedExercises = day.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, sets: newSets } : ex
        );
        setDay({ ...day, exercises: updatedExercises });
        setIsDirty(true);
      }
    } catch (error) {
      console.error("Error deleting set:", error);
    }
  };

  const handleSaveWorkout = async () => {
    try {
      const docRef = await addDoc(
        collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts`
        ),
        {
          name: day.name,
          date: formattedDateTime,
          duration: time,
          userId: FIREBASE_AUTH.currentUser.uid,
        }
      );

      const workoutDoc = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${docRef.id}`
      );
      await updateDoc(workoutDoc, { id: docRef.id });

      for (const exercise of day.exercises) {
        const exerciseDocRef = await addDoc(
          collection(
            FIRESTORE_DB,
            `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${docRef.id}/Exercise`
          ),
          {
            name: exercise.name,
            sets: exercise.sets,
            workoutId: docRef.id,
          }
        );
        const exerciseDoc = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${docRef.id}/Exercise/${exerciseDocRef.id}`
        );
        await updateDoc(exerciseDoc, { id: exerciseDocRef.id });
      }
      console.log(docRef.id);
      router.push({
        pathname: "/(tabs)/(workout)/create",
        params: {
          workoutId: docRef.id,
        },
      });
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleEndWorkout = () =>
    Alert.alert("Finished Workout?", "", [
      {
        text: "Yes",
        onPress: () => handleSaveWorkout(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete Workout", onPress: () => router.back() },
    ]);

  const updateSets = (day, exerciseIndex, setIndex, property, value) => {
    const newDay = {
      ...day,
      exercises: day.exercises.map((prevExercise, eIndex) =>
        eIndex === exerciseIndex
          ? {
              ...prevExercise,
              sets: prevExercise.sets.map((prevSet, sIndex) =>
                sIndex === setIndex
                  ? { ...prevSet, [property]: value }
                  : prevSet
              ),
            }
          : prevExercise
      ),
    };
    setDay(newDay);
    setIsDirty(true);
  };

  const renderSetInputs = (sets, exerciseIndex, day, exercise) => {
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
            <Text style={styles.baseText}>{`Set ${setIndex + 1}`}</Text>
            {!exercise.cardio && (
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newReps) =>
                  updateSets(day, exerciseIndex, setIndex, "reps", newReps)
                }
                value={set.reps.toString()}
              />
            )}
            {!exercise.cardio && <Text>x</Text>}
            {!exercise.cardio && (
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newWeight) =>
                  updateSets(
                    day,
                    exerciseIndex,
                    setIndex,
                    "weight_duration",
                    isMetric
                      ? parseFloat(newWeight) * 2.205
                      : parseFloat(newWeight)
                  )
                }
                value={
                  isMetric
                    ? Math.floor(set.weight_duration / 2.205).toString()
                    : Math.floor(set.weight_duration).toString()
                }
              />
            )}
            {!exercise.cardio && <Text>{isMetric ? "kg" : "lbs"}</Text>}
            {exercise.cardio && (
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newDuration) =>
                  updateSets(
                    day,
                    exerciseIndex,
                    setIndex,
                    "weight_duration",
                    newDuration
                  )
                }
                value={set.weight_duration.toString()}
              />
            )}
            <Button
              title="Delete Set"
              onPress={() => handleDeleteSet(day, exerciseIndex, setIndex)}
            />
          </View>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.titleText}>
          {Math.floor(time / 60)}:{time % 60}
        </Text>
        <Button title="End Workout" onPress={handleEndWorkout} />
        <Text style={styles.baseText}>{day?.name}</Text>
        <TextInput
          style={styles.input}
          onChangeText={(newName) => setNameAndSave(newName)}
          value={day?.name}
        />
        <ScrollView>
          <View>
            {day?.exercises &&
              day?.exercises.map((exercise, exerciseIndex) => (
                <View key={exercise.id}>
                  <Text style={styles.baseText}>{exercise.name}</Text>
                  <Button
                    title="Delete Exercise"
                    onPress={() => handleDeleteExercise(day.id, exercise.id)}
                  />
                  {renderSetInputs(exercise.sets, exerciseIndex, day, exercise)}
                  <Button
                    title={"Add Set"}
                    onPress={() => handleAddSet(day.id, exercise.id)}
                  />
                </View>
              ))}
            <Button
              title="Add Exercise"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(workout)/search",
                  params: {
                    userId: FIREBASE_AUTH.currentUser.uid,
                    dayId: dayId,
                    planId: planId,
                  },
                })
              }
            />
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
export default WorkoutScreen;
