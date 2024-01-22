import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Appearance,
  ScrollView,
} from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../firebaseConfig";
import {
  updateDoc,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

function ViewPlanScreen({ route, navigation }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [name, setName] = useState("");
  const [plan, setPlan] = useState({});
  const [days, setDays] = useState([]);
  useEffect(() => {
    const fetchPlanFromFirestore = async () => {
      try {
        const planDoc = await getDoc(
          doc(FIRESTORE_DB, `Plans/${route.params.id}`)
        );
        const planData = planDoc.data();
        setPlan(planData);
        setName(planData.name);

        const daysCollection = collection(planDoc.ref, "Days");
        const daysSnapshot = await getDocs(daysCollection);
        const daysData = [];

        for (const dayDoc of daysSnapshot.docs) {
          const dayData = dayDoc.data();

          const exercisesCollection = collection(dayDoc.ref, "Exercise");
          const exercisesSnapshot = await getDocs(exercisesCollection);
          const exercisesData = exercisesSnapshot.docs.map((exerciseDoc) =>
            exerciseDoc.data()
          );
          dayData.exercises = exercisesData;
          daysData.push(dayData);
        }
        setDays(daysData);
        console.log("plan");
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchPlanFromFirestore();
  }, []);
  const handleSavePlan = async () => {
    const planDoc = doc(FIRESTORE_DB, `Plans/${route.params.id}`);
    updateDoc(planDoc, { name: name });
  };
  const handleAddDay = async () => {
    const planDoc = doc(FIRESTORE_DB, `Plans/${route.params.id}`);
    const daysCollection = collection(planDoc, "Days");
    const daysDocRef = await addDoc(daysCollection, {
      name: "New Day",
      planId: route.params.id,
    });
    const dayDoc = doc(daysCollection, daysDocRef.id);
    await updateDoc(dayDoc, { id: daysDocRef.id });
    const daysSnapshot = await getDocs(daysCollection);
    const daysData = daysSnapshot.docs.map((doc) => doc.data());
    setDays(daysData);
  };

  const handleAddSet = async (dayId, exerciseId, exercise, days) => {
    const exerciseDoc = doc(
      FIRESTORE_DB,
      `Plans/${route.params.id}/Days/${dayId}/Exercise/${exerciseId}`
    );
    const exerciseDocSnap = await getDoc(exerciseDoc);

    if (exerciseDocSnap.exists()) {
      const currentSets = exerciseDocSnap.data().sets || [];
      const newSets = [...currentSets, { reps: 0, weight_duration: 0 }];
      await updateDoc(exerciseDoc, { sets: newSets });
      const updatedDays = days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, sets: newSets } : ex
              ),
            }
          : day
      );
      setDays(updatedDays);
    }
  };

  const handleDeleteDay = async (dayId) => {
    try {
      const dayDocRef = doc(
        FIRESTORE_DB,
        `Plans/${route.params.id}/Days/${dayId}`
      );
      await deleteDoc(dayDocRef);
      setDays((prevDays) => prevDays.filter((day) => day.id !== dayId));
    } catch (error) {
      console.error("Error deleting day:", error);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Button title="Save" onPress={handleSavePlan} />
        <Text style={styles.baseText}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          value={name}
        />
        <ScrollView>
          {days.map((day) => (
            <View key={day.id}>
              <Text style={styles.titleText}>{day.name}</Text>
              {day.exercises &&
                day.exercises.map((exercise) => (
                  <View key={exercise.id}>
                    <Text style={styles.baseText}>{exercise.name}</Text>
                    {exercise.sets.map((sets, index) => (
                      <Text style={styles.baseText}>{`Set ${index + 1} Reps: ${
                        sets.reps
                      } ${exercise.cardio ? `Duration: ` : `Weight: `} ${
                        sets.weight_duration
                      } `}</Text>
                    ))}
                    <Button
                      title={"Add Set"}
                      onPress={() =>
                        handleAddSet(day.id, exercise.id, exercise, days)
                      }
                    />
                  </View>
                ))}
              <Button
                title="Add Exercise"
                onPress={() =>
                  navigation.navigate("SearchExercise", {
                    dayId: day.id,
                    planId: route.params.id,
                  })
                }
              />
              <Button title="Delete" onPress={() => handleDeleteDay(day.id)} />
            </View>
          ))}
          <Button title="Add Day" onPress={handleAddDay} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default ViewPlanScreen;
