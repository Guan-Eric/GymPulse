import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Roboto_700Bold, Roboto_400Regular } from "@expo-google-fonts/roboto";
import { ThemeProvider, createTheme } from "@rneui/themed";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";

const theme = createTheme({
  lightColors: {
    primary: "#3490de", // Primary blue
    secondary: "#f5a623", // Complementary orange
    background: "#ffffff", // White background for light mode
    white: "#f8f9fa", // Pure white
    black: "#222222", // Soft black for text
    grey0: "#f8f9fa", // Lightest grey
    grey1: "#e9ecef", // Light grey
    grey2: "#dee2e6", // Medium light grey
    grey3: "#ced4da", // Neutral grey
    grey4: "#adb5bd", // Darker grey
    grey5: "#6c757d", // Dark grey
    greyOutline: "#dcdcdc", // Outline grey
    searchBg: "#f1f3f5", // Light grey background for search
    success: "#28a745", // Green for success
    error: "#dc3545", // Red for errors
    warning: "#ffc107", // Yellow for warnings
    divider: "#e0e0e0", // Divider line color
  },
  darkColors: {
    primary: "#3490de", // Same primary blue
    secondary: "#f5a623", // Complementary orange
    background: "#181818", // Deep dark grey background
    white: "#e5e5e5", // Soft greyish-white
    black: "#f8f9fa", // Off-white for text
    grey0: "#1f1f1f", // Subtle dark grey
    grey1: "#2b2b2b", // Slightly lighter grey
    grey2: "#3a3a3a", // Neutral dark grey
    grey3: "#4f4f4f", // Medium grey
    grey4: "#6c757d", // Light grey
    grey5: "#adb5bd", // Lightest grey
    greyOutline: "#333333", // Outline grey for dark mode
    searchBg: "#262626", // Slightly lighter dark grey for search
    success: "#28a745", // Green for success (same as light mode)
    error: "#dc3545", // Red for errors (same as light mode)
    warning: "#ffc107", // Yellow for warnings (same as light mode)
    divider: "#2d2d2d", // Subtle divider line for dark mode
  },
  mode: "dark" as "light" | "dark", // Default to dark mode
});

function AppLayout() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });
  theme.mode = useColorScheme();
  console.log(Constants.expoConfig?.extra?.revenueCatApiKey);
  Purchases.configure({
    apiKey: Constants.expoConfig?.extra?.revenueCatApiKey,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default AppLayout;
