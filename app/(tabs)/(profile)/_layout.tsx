import { Stack } from "expo-router";
import React from "react";

function ProfileStackLayout(props) {
  return (
    <Stack initialRouteName="user">
      <Stack.Screen
        name="user"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="post" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ headerShown: false }} />
      <Stack.Screen name="displaySettings" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="profileSettings" options={{ headerShown: false }} />
      <Stack.Screen
        name="profileDetailUpdate"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default ProfileStackLayout;
