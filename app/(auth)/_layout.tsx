import React from "react";
import { Stack } from "expo-router";

function LoginStackLayout(props) {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />

      <Stack.Screen
        name="signin"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen
        name="presignup"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default LoginStackLayout;
