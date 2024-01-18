import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Button,
  Appearance,
  ScrollView,
} from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

function PlanScreen({ navigation }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchExerciseFromFirestore = async () => {
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
        console.log("plans");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchExerciseFromFirestore();
  }, []);
  const handleCreatePlan = () => {
    navigation.navigate("ViewPlan");
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>Your Plan</Text>
        <Button title="Create Plan" onPress={handleCreatePlan} />
        <ScrollView>
          {plans.length == 0 ? (
            <Text>No plans available. Create a new plan!</Text>
          ) : (
            plans.map((item) => (
              <Pressable
                key={item.name}
                onPress={() => navigation.navigate("ViewPlan", { item })}
              >
                <Text style={styles.titleText}>{item.name}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default PlanScreen;
