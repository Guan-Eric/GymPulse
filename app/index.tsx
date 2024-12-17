import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import WelcomeScreen from "./(auth)/welcome";

function App() {
  const router = useRouter();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.replace("/(tabs)/(home)/feed");
    } else {
      router.replace("/(auth)/welcome");
    }
  });

  return <WelcomeScreen />;
}

export default App;
