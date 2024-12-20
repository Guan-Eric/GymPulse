import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { updateDoc, doc, collection, addDoc } from "firebase/firestore";
import { Plan } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import DayCard from "../../../components/DayCard";
import { Button, useTheme } from "@rneui/themed";
import { getPlan, savePlan } from "../../../backend/plan";
import { getUser } from "../../../backend/user";
import FinishWorkoutModal from "../../../components/FinishWorkoutModal";

function WorkoutScreen() {
  const currentDate = new Date();
  const [plan, setPlan] = useState<Plan>();
  const [isWeightMetric, setIsWeightMetric] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const { dayIndex, planId, dayId, workoutTime } = useLocalSearchParams();
  const [isModal, setIsModal] = useState<boolean>(false);
  const { theme } = useTheme();

  const startStopwatch = () => {
    startTimeRef.current = Date.now() - Number(workoutTime as string) * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
  };

  const fetchPlanFromFirestore = async () => {
    setPlan(await getPlan(planId as string));
    setIsWeightMetric(
      (await getUser(FIREBASE_AUTH.currentUser.uid)).weightMetricUnits
    );
  };

  useEffect(() => {
    if (plan) {
      savePlan(plan);
    }
  }, [plan]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanFromFirestore();
      startStopwatch();
    }, [])
  );

  useEffect(() => {
    fetchPlanFromFirestore();
    startStopwatch();
  }, []);

  const handleSaveWorkout = async () => {
    try {
      pauseStopwatch();
      setIsModal(false);
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
          dayIndex: dayIndex,
          planId: planId,
          dayId: dayId,
        },
      });
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.titleText, { color: theme.colors.black }]}>
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </Text>
          <Button
            style={{ paddingRight: 20 }}
            buttonStyle={{
              width: 150,
              borderRadius: 20,
              backgroundColor: theme.colors.error,
            }}
            title="End Workout"
            onPress={() => setIsModal(true)}
          />
        </View>
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
            workoutTime={null}
          />
        </ScrollView>
        <FinishWorkoutModal
          modalVisible={isModal}
          onClose={() => setIsModal(false)}
          onSaveWorkout={handleSaveWorkout}
          onDeleteWorkout={() => {
            setIsModal(false);
            router.push("/(tabs)/(workout)/plans");
          }}
          theme={theme}
        />
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
    paddingLeft: 20,
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
