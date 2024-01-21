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
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function PlanScreen({ navigation }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchExerciseFromFirestore = () => {
      const collectionRef = collection(FIRESTORE_DB, "Plans");
      const queryRef = query(
        collectionRef,
        where("email", "==", FIREBASE_AUTH.currentUser.email)
      );

      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setPlans(data);
        console.log("plans");
      });

      return () => unsubscribe();
    };
    fetchExerciseFromFirestore();
  }, []);
  const handleCreatePlan = async () => {
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, "Plans"), {
        name: "New Plan",
        email: FIREBASE_AUTH.currentUser.email,
      });
      const planDoc = doc(FIRESTORE_DB, `Plans/${docRef.id}`);
      await updateDoc(planDoc, { id: docRef.id });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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
                onPress={() => navigation.navigate("ViewPlan", { id: item.id })}
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
