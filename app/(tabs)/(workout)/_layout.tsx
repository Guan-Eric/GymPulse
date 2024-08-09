import { Stack } from "expo-router";
import React from "react";

function WorkoutStackLayout(props) {
  return (
    <Stack initialRouteName="plans">
      <Stack.Screen name="plans" options={{ headerShown: false }} />
      <Stack.Screen name="bodypart" options={{ headerShown: false }} />
      <Stack.Screen name="exercise" options={{ headerShown: false }} />
      <Stack.Screen name="exercises" options={{ headerShown: false }} />
      <Stack.Screen name="plan" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen
        name="workout"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default WorkoutStackLayout;
