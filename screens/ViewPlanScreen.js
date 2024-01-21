import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Appearance,
  ScrollView,
} from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../firebaseConfig";
import { updateDoc, getDoc, doc, collection, addDoc } from "firebase/firestore";

function ViewPlanScreen({ route }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [name, setName] = useState();
  const [plan, setPlan] = useState();
  const [exercises, setExercises] = useState();
  useEffect(() => {
    const fetchPlanFromFirestore = async () => {
      try {
        const planDoc = await getDoc(
          doc(FIRESTORE_DB, `Plans/${route.params.item.id}`)
        );
        const planData = planDoc.data();
        setPlan(planData);
        console.log("plan");
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchPlanFromFirestore();
  }, []);
  const handleSavePlan = async () => {
    const planDoc = doc(FIRESTORE_DB, `Plans/${route.params.item.id}`);
    updateDoc(planDoc, { name: name });
    //update for all days and all exercises
  };
  const handleAddDay = async () => {
    const planDoc = doc(FIRESTORE_DB, `Plans/${route.params.item.id}`);
    const daysCollection = collection(planDoc, "Days");
    const daysDocRef = await addDoc(daysCollection, {
      name: "New Day",
      planId: route.params.item.id,
    });
    const dayDoc = doc(FIRESTORE_DB, `Days/${daysDocRef.id}`);
    await updateDoc(dayDoc, { id: daysDocRef.id });
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Button title="Save" onPress={handleSavePlan} />
        <Text style={styles.baseText}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          value={name}
        />
        <ScrollView>
          {}
          <Button title="Add Day" onPress={handleAddDay} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default ViewPlanScreen;
