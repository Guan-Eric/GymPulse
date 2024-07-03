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
import ExerciseCard from "../../../components/ExerciseCard";
import { useTheme } from "@rneui/themed";

function AddExerciseScreen() {
  const [imageUrls, setImageUrls] = useState([]);
  const { exerciseId, planId, dayId } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();

  const { theme } = useTheme();

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
    router.back();
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ paddingBottom: 70 }}>
        {exercise && (
          <View>
            <Button title="Add Exercise" onPress={handleAddExercise} />
            <ExerciseCard exercise={exercise} imageUrls={imageUrls} />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

export default AddExerciseScreen;
