import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plan, Workout } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button, Card } from "@rneui/themed";
import { addDay, deletePlan, getPlan, savePlan } from "../../../backend/plan";
import DayCard from "../../../components/DayCard";
import { getWorkout } from "../../../backend/workout";
import { getMetric } from "../../../backend/user";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

function ViewWorkoutScreen() {
  const [workout, setWorkout] = useState<Workout>();
  const [isMetric, setIsMetric] = useState(true);
  const { workoutId } = useLocalSearchParams();
  const { theme } = useTheme();

  const fetchWorkoutFromFirestore = async () => {
    setWorkout(await getWorkout(workoutId as string));
    setIsMetric(await getMetric(FIREBASE_AUTH.currentUser.uid));
  };

  useEffect(() => {
    fetchWorkoutFromFirestore();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <SafeAreaView style={{ paddingBottom: 35 }}>
        <ScrollView>
          <DayCard
            plan={null}
            day={workout}
            dayIndex={null}
            theme={theme}
            isMetric={isMetric}
            setPlan={null}
            isWorkout={false}
            isDisabled={true}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  nameInput: {
    width: "100%",
  },
});

export default ViewWorkoutScreen;
