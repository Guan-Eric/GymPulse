import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Appearance,
  Image,
  ScrollView,
  Button,
  FlatList,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_STR } from "../../../firebaseConfig";
import {
  updateDoc,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { Exercise } from "../../../components/types";

function AddExerciseScreen() {
  const [imageUrls, setImageUrls] = useState([]);
  const { exerciseId, planId, dayId } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exerciseDoc = await getDoc(
          doc(FIRESTORE_DB, `Exercises/${exerciseId}`)
        );
        setExercise(exerciseDoc.data() as Exercise);
        
        const image1Ref = ref(FIREBASE_STR, `assets/${exerciseId}_0.jpg`);
        const url1 = await getDownloadURL(image1Ref);
        const image2Ref = ref(FIREBASE_STR, `assets/${exerciseId}_1.jpg`);
        const url2 = await getDownloadURL(image2Ref);
        setImageUrls([
          { id: 0, uri: url1 },
          { id: 1, uri: url2 },
        ]);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      }
    };

    fetchExercise();
  }, []);
  const instructions = exercise?.instructions.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const secondaryMuscles = exercise?.secondaryMuscles.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const handleAddExercise = async () => {
    const dayDoc = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Days/${dayId}`
    );
    const exerciseCollection = collection(dayDoc, "Exercise");
    const exerciseDocRef = await addDoc(exerciseCollection, {
      name: exercise.name,
      dayId: dayId,
      sets: [{ reps: 0, weight_duration: 0 }],
      cardio: exercise.category == "cardio",
    });
    const exerciseDoc = doc(exerciseCollection, exerciseDocRef.id);
    await updateDoc(exerciseDoc, { id: exerciseDoc.id });
    router.back();
    router.back();
  };
  return (
    <View>
      <SafeAreaView>
        <FlatList
          horizontal={true}
          data={imageUrls}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.uri }}
              style={{
                resizeMode: "cover",
                height: 150,
                width: 150,
              }}
            />
          )}
        />
        <ScrollView>
          <Text>{exercise?.name}</Text>
          <Button title="Add Exercise" onPress={handleAddExercise} />
          <Text>Equipment</Text>
          <Text>{exercise?.equipment}</Text>
          <Text>Secondary Muscles</Text>
          {secondaryMuscles}
          <Text>Level</Text>
          <Text>{exercise?.level}</Text>
          <Text>Instructions</Text>
          {instructions}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
export default AddExerciseScreen;
