import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import WelcomeScreen from "./(auth)/welcome";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { MobileAds } from "react-native-google-mobile-ads";
import { View } from "react-native";

function App() {
  const router = useRouter();

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob initialized");
      });
  }, []);

  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
      router.replace("/(tabs)/(home)/feed");
    } else {
      router.replace("/(auth)/welcome");
    }
  });

  return <View style={{ flex: 1, backgroundColor: "#181818" }} />;
}

export default App;
