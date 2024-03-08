import { Stack } from "expo-router";
import React from "react";

function HistoryStackLayout(props) {
  return (
    <Stack initialRouteName="history">
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ headerShown: false }} />
      <Stack.Screen name="exercise" options={{ headerShown: false }} />
    </Stack>
  );
}

export default HistoryStackLayout;
