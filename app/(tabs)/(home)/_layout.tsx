import { Stack } from "expo-router";
import React from "react";

function SocialStackLayout(props) {
  return (
    <Stack initialRouteName="feed">
      <Stack.Screen name="feed" options={{ headerShown: false }} />
      <Stack.Screen name="post" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ headerShown: false }} />
    </Stack>
  );
}

export default SocialStackLayout;
