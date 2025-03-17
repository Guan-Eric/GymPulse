// app/index.tsx
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

export default function App() {
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // Navigate to the home screen if the user is logged in
        router.replace("/(tabs)/(home)/feed");
      } else {
        // Navigate to the welcome screen if the user is not logged in
        router.replace("/(auth)/welcome");
      }
      setLoading(false); // Set loading to false after the initial auth check
    });

    // Keep the listener active (no cleanup)
    // return () => unsubscribe(); // Comment this out to keep the listener active
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#181818",
        }}
      >
        <Image
          source={{ uri: "../assets/iconSplash.png" }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Render nothing (navigation is handled by the router)
  return null;
}
