import { Stack } from "expo-router";
import React from "react";

function AiStackLayout(props) {
  return (
    <Stack initialRouteName="ai">
      <Stack.Screen
        name="ai"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="generatePlanScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="suggestExerciseScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default AiStackLayout;
