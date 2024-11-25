import { Stack } from "expo-router";
import React from "react";

function SummaryStackLayout(props) {
  return (
    <Stack initialRouteName="summary">
      <Stack.Screen name="summary" options={{ headerShown: false }} />
    </Stack>
  );
}

export default SummaryStackLayout;
