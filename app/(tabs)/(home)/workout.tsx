import React from "react";
import { useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import ViewWorkoutScreen from "../../../components/ViewWorkoutScreen";

function WorkoutScreen() {
  const { theme } = useTheme();
  const { workoutId } = useLocalSearchParams();

  return <ViewWorkoutScreen theme={theme} workoutId={workoutId} />;
}

export default WorkoutScreen;
