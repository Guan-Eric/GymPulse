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
import { Day, Plan } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import DayCard from "../../../components/DayCard";
import { useTheme } from "@rneui/themed";
import { setDay } from "date-fns";
import { getPlan, savePlan } from "../../../backend/plan";
import { getWeightMetric } from "../../../backend/user";

function WorkoutScreen() {
  const currentDate = new Date();
  const [plan, setPlan] = useState<Plan>();
  const [isDirty, setIsDirty] = useState(false);
  const [isWeightMetric, setIsWeightMetric] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const { dayIndex, planId, dayId } = useLocalSearchParams();
  const { theme } = useTheme();

  const startStopwatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setRunning(true);
  };

  const fetchPlanFromFirestore = async () => {
    setPlan(await getPlan(planId as string));
    setIsWeightMetric(await getWeightMetric(FIREBASE_AUTH.currentUser.uid));
  };

  useEffect(() => {
    if (plan) {
      savePlan(plan);
    }
  }, [plan]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanFromFirestore();
    }, [])
  );

  useEffect(() => {
    fetchPlanFromFirestore();
    startStopwatch();
  }, []);

  const handleSaveWorkout = async () => {
    try {
      const docRef = await addDoc(
        collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts`
        ),
        {
          name: plan?.days[dayIndex as string].name,
          date: currentDate,
          duration: time,
          userId: FIREBASE_AUTH.currentUser.uid,
        }
      );

      const workoutDoc = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${docRef.id}`
      );
      await updateDoc(workoutDoc, { id: docRef.id });

      for (const exercise of plan?.days[dayIndex as string].exercises) {
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
      router.push({
        pathname: "/(tabs)/(workout)/create",
        params: {
          workoutId: docRef.id,
          planName: plan.name,
          dayName: plan.days[dayIndex as string].name,
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

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={[styles.titleText, { color: theme.colors.black }]}>
          {Math.floor(time / 60)}:{time % 60}
        </Text>
        <Button title="End Workout" onPress={handleEndWorkout} />
        <ScrollView>
          <DayCard
            key={dayId as string}
            plan={plan}
            day={plan?.days[dayIndex as string]}
            dayIndex={Number(dayIndex)}
            theme={theme}
            isWeightMetric={isWeightMetric}
            setPlan={setPlan}
            isWorkout={true}
            isDisabled={false}
          />
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
