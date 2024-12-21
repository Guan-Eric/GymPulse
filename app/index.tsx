import React from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import WelcomeScreen from "./(auth)/welcome";
import { FIREBASE_AUTH } from "../firebaseConfig";

function App() {
  const router = useRouter();

  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
      router.replace("/(tabs)/(home)/feed");
    } else {
      router.replace("/(auth)/welcome");
    }
  });

  return <WelcomeScreen />;
}

export default App;
