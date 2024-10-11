import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Roboto_700Bold, Roboto_400Regular } from "@expo-google-fonts/roboto";
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { Alata_400Regular } from "@expo-google-fonts/alata";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const theme = createTheme({
  lightColors: {
    primary: "#3490de",
    black: "black",
    background: "white",
  },
  darkColors: {
    primary: "#3490de",
    black: "white",
    background: "#181818",
  },
  mode: "dark" as "light" | "dark",
});

function AppLayout() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Lato_400Regular,
    Lato_700Bold,
    Anton_400Regular,
    Alata_400Regular,
  });
  theme.mode = useColorScheme();

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}

export default AppLayout;
