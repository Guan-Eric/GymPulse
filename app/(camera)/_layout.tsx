import { Stack } from "expo-router";
import React from "react";

function CameraStackLayout(props) {
  return (
    <Stack initialRouteName="camera">
      <Stack.Screen name="camera" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}

export default CameraStackLayout;
