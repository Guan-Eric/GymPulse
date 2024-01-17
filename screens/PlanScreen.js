import React, { useEffect, useState } from "react";
import { Text, View, Pressable, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

function PlanScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [plans, setPlans] = useState([]);
  const fetchPlanFromFirestore = async () => {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Plans");
      const queryRef = query(
        collectionRef,
        where("email", "==", FIREBASE_AUTH.currentUser.email)
      );

      const querySnapshot = await getDocs(queryRef);

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setPlans(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  useEffect(() => {
    if (plans.length == 0) fetchPlanFromFirestore();
  });
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>Your Plan</Text>
        <Button title="Create Plan" />
      </SafeAreaView>
    </View>
  );
}

export default PlanScreen;
