import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/(home)/feed");
      } else {
        router.replace("/(auth)/welcome");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <View style={{ flex: 1 }}></View>;
}

export default App;
