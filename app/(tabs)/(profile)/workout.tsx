import React from "react";
import { useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import ViewWorkoutScreen from "../../../components/ViewWorkoutScreen";

function WorkoutScreen() {
  const { theme } = useTheme();
  const { workoutId, userId } = useLocalSearchParams();

  return (
    <ViewWorkoutScreen theme={theme} workoutId={workoutId} userId={userId} />
  );
}

export default WorkoutScreen;
