import "../global.css";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Roboto_700Bold, Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppLayout() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default AppLayout;
