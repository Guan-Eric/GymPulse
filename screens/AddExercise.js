import React from "react";
import {
  View,
  Text,
  Appearance,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/Theme";
import { FIRESTORE_DB } from "../firebaseConfig";
import {
  updateDoc,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

function AddExerciseScreen({ route, navigation }) {
  const exercise = route.params.exercise;
  const instructions = exercise.instructions.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const secondaryMuscles = exercise.secondaryMuscles.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const handleAddExercise = async () => {
    const dayDoc = doc(
      FIRESTORE_DB,
      `Users/${route.params.userId}/Plans/${route.params.planId}/Days/${route.params.dayId}`
    );
    const exerciseCollection = collection(dayDoc, "Exercise");
    const exerciseDocRef = await addDoc(exerciseCollection, {
      name: exercise.name,
      dayId: route.params.dayId,
      sets: [{ reps: 0, weight_duration: 0 }],
      cardio: exercise.category == "cardio",
    });
    const exerciseDoc = doc(exerciseCollection, exerciseDocRef.id);
    await updateDoc(exerciseDoc, { id: exerciseDoc.id });
    navigation.navigate("Home");
    navigation.navigate("ViewPlan", {
      planId: route.params.planId,
      userId: route.params.userId,
    });
  };
  return (
    <View>
      <SafeAreaView>
        <Image
          source={{ uri: exercise.images[0] }}
          style={{
            resizeMode: "cover",
            height: 150,
            width: 150,
          }}
        />
        <ScrollView>
          <Text>{exercise.name}</Text>
          <Button title="Add Exercise" onPress={handleAddExercise} />
          <Text>Equipment</Text>
          <Text>{exercise.equipment}</Text>
          <Text>Secondary Muscles</Text>
          {secondaryMuscles}
          <Text>Level</Text>
          <Text>{exercise.level}</Text>
          <Text>Instructions</Text>
          {instructions}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default AddExerciseScreen;
