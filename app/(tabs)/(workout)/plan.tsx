import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import {
  updateDoc,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Day, Plan } from "../../../components/types";
import { router, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button } from "@rneui/themed";
import { getPlan, savePlan } from "../../../backend/plan";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isDirty, setIsDirty] = useState(false);
  const [isMetric, setIsMetric] = useState();
  const { userId, planId } = useLocalSearchParams();
  const { theme } = useTheme();

  useEffect(() => {
    if (isDirty) {
      handleSavePlan();
      setIsDirty(false);
    }
  }, [plan.name, plan.days, isDirty]);

  useEffect(() => {
    const fetchPlanFromFirestore = async () => {
      setPlan(await getPlan(planId as string));
    }

    fetchPlanFromFirestore();
  }, []);

  const handleSavePlan = async () => {
    const planDocRef = doc(FIRESTORE_DB, `Users/${userId}/Plans/${planId}`);
    updateDoc(planDocRef, { name: plan.name });
    for (const day of plan.days) {
      const dayDocRef = doc(planDocRef, `Days/${day.id}`);
      await updateDoc(dayDocRef, { name: day.name });

      for (const exercise of day.exercises) {
        const exerciseDocRef = doc(dayDocRef, `Exercise/${exercise.id}`);
        await updateDoc(exerciseDocRef, {
          name: exercise.name,
          sets: exercise.sets,
        });
      }
    }
  };
  
  const handleAddDay = async () => {
    try {
      const planDoc = doc(FIRESTORE_DB, `Users/${userId}/Plans/${planId}`);
      const daysCollection = collection(planDoc, "Days");
      const daysDocRef = await addDoc(daysCollection, {
        name: "New Day",
        planId: planId,
      });
      const dayDoc = doc(daysCollection, daysDocRef.id);
      await updateDoc(dayDoc, { id: daysDocRef.id });
      const newDayDoc = await getDoc(doc(daysCollection, daysDocRef.id));
      const newDayData = newDayDoc.data() as Day;
  
      setPlan((prevPlan) => ({
        ...prevPlan,
        days: [...(prevPlan?.days || []), newDayData],
      }));
      setIsDirty(true);
    } catch (error) {
      console.error("Error adding new day:", error);
    }
  };  

  const handleAddSet = async (dayId, exerciseId, days) => {
    const exerciseDoc = doc(
      FIRESTORE_DB,
      `Users/${userId}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
    );
    const exerciseDocSnap = await getDoc(exerciseDoc);

    if (exerciseDocSnap.exists()) {
      const currentSets = exerciseDocSnap.data().sets || [];
      const newSets = [...currentSets, { reps: 0, weight_duration: 0 }];
      await updateDoc(exerciseDoc, { sets: newSets });
      const updatedPlan = days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, sets: newSets } : ex
              ),
            }
          : day
      );
      setPlan(updatedPlan);
      setIsDirty(true);
    }
  };

  const handleDeleteDay = async (dayId) => {
    try {
      const dayDocRef = doc(
        FIRESTORE_DB,
        `Users/${userId}/Plans/${planId}/Days/${dayId}`
      );
      const exercisesCollectionRef = collection(dayDocRef, "Exercise");
      const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);
  
      exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
        await deleteDoc(exerciseDoc.ref);
      });
      await deleteDoc(dayDocRef);
      setPlan((prevPlan) => ({
        ...prevPlan,
        days: prevPlan?.days.filter((day) => day.id !== dayId),
      }));
      setIsDirty(true);
    } catch (error) {
      console.error("Error deleting day:", error);
    }
  };
  
  const handleDeleteExercise = async (dayId, exerciseId) => {
    try {
      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${userId}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
      );
      await deleteDoc(exerciseDocRef);
      setPlan((prevPlan) => ({
        ...prevPlan,
        days: prevPlan?.days.map((prevDay) =>
          prevDay.id === dayId
            ? {
                ...prevDay,
                exercises: prevDay.exercises.filter(
                  (exercise) => exercise.id !== exerciseId
                ),
              }
            : prevDay
        ),
      }));
      setIsDirty(true);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };
  
  const handleDeleteSet = (dayIndex, exerciseIndex, setIndex) => {
    setPlan((prevPlan) => ({
      ...prevPlan,
      days: prevPlan?.days.map((prevDay, dIndex) =>
        dIndex === dayIndex
          ? {
              ...prevDay,
              exercises: prevDay.exercises.map((prevExercise, eIndex) =>
                eIndex === exerciseIndex
                  ? {
                      ...prevExercise,
                      sets: prevExercise.sets.filter(
                        (set, sIndex) => sIndex !== setIndex
                      ),
                    }
                  : prevExercise
              ),
            }
          : prevDay
      ),
    }));
    setIsDirty(true);
  };
  
  const updateSets = (dayIndex, exerciseIndex, setIndex, property, value) => {
    setPlan((prevPlan) => ({
      ...prevPlan,
      days: prevPlan?.days.map((prevDay, dIndex) =>
        dIndex === dayIndex
          ? {
              ...prevDay,
              exercises: prevDay.exercises.map((prevExercise, eIndex) =>
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
            }
          : prevDay
      ),
    }));
    setIsDirty(true);
  };
  
  const updateDayName = (dayIndex, newName) => {
    setPlan((prevPlan) => ({
      ...prevPlan,
      days: prevPlan?.days.map((day, index) =>
        index === dayIndex ? { ...day, name: newName } : day
      ),
    }));
    setIsDirty(true);
  };  

  const renderSetInputs = (sets, exerciseIndex, dayIndex, exercise) => {
    return (
      <View>
        <View style={styles.setRow}>
          {!exercise.cardio && (
            <View style={styles.setRow}>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Reps
              </Text>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Weight
              </Text>
            </View>
          )}
          {exercise.cardio && <Text style={styles.baseText}>Duration</Text>}
        </View>
        {sets.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text
              style={[styles.baseText, { color: theme.colors.black }]}
            >{`Set ${setIndex + 1}`}</Text>
            {!exercise.cardio && (
              <Input
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newReps) =>
                  updateSets(dayIndex, exerciseIndex, setIndex, "reps", newReps)
                }
                value={set.reps.toString()}
              />
            )}
            {!exercise.cardio && (
              <Text style={{ color: theme.colors.black }}>x</Text>
            )}
            {!exercise.cardio && (
              <Input
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newWeight) =>
                  updateSets(
                    dayIndex,
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
            {!exercise.cardio && (
              <Text style={{ color: theme.colors.black }}>
                {isMetric ? "kg" : "lbs"}
              </Text>
            )}
            {exercise.cardio && (
              <Input
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newDuration) =>
                  updateSets(
                    dayIndex,
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
              type="clear"
              title="Delete Set"
              onPress={() => handleDeleteSet(dayIndex, exerciseIndex, setIndex)}
            />
          </View>
        ))}
      </View>
    );
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Input
          style={styles.nameInput}
          onChangeText={() => handleSavePlan()}
          value={plan?.name}
        />
        <ScrollView>
          {plan?.days.map((day, dayIndex) => (
            <View key={day.id}>
              <View style={{ flexDirection: "row" }}>
                <Input
                  style={styles.nameInput}
                  onChangeText={(newDayName) =>
                    updateDayName(dayIndex, newDayName)
                  }
                  value={day.name}
                />
                <Button
                  title="Start Workout"
                  type="clear"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(workout)/workout",
                      params: {
                        userId: userId,
                        planId: planId,
                        dayId: day.id,
                      },
                    })
                  }
                />
              </View>
              {day.exercises &&
                day.exercises.map((exercise, exerciseIndex) => (
                  <View key={exercise.id}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={[styles.baseText, { color: theme.colors.black }]}
                      >
                        {exercise.name}
                      </Text>
                      <Button
                        type="clear"
                        title="Delete Exercise"
                        onPress={() =>
                          handleDeleteExercise(day.id, exercise.id)
                        }
                      />
                    </View>
                    {renderSetInputs(
                      exercise.sets,
                      exerciseIndex,
                      dayIndex,
                      exercise
                    )}
                    <Button
                      size="sm"
                      type="clear"
                      title="Add Set"
                      onPress={() => handleAddSet(day.id, exercise.id, plan?.days)}
                    />
                  </View>
                ))}
              <Button
                type="clear"
                title="Add Exercise"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/search",
                    params: {
                      userId: userId,
                      planId: planId,
                      dayId: day.id,
                    },
                  })
                }
              />
              <Button
                type="clear"
                title="Delete Day"
                onPress={() => handleDeleteDay(day.id)}
              />
            </View>
          ))}
          <Button type="clear" title="Add Day" onPress={handleAddDay} />
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
  input: { width: 50 },
  nameInput: {},
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
export default ViewPlanScreen;