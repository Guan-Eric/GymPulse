import { Stack } from "expo-router";
import React from "react";

function SocialStackLayout(props) {
  return (
    <Stack initialRouteName="feed">
      <Stack.Screen name="camera" options={{ headerShown: false }} />
      <Stack.Screen name="feed" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="post" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}

export default SocialStackLayout;
