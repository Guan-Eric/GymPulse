import React, { useState, useEffect } from "react";
import { Alert, Platform, View } from "react-native";
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
  setDoc,
} from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { Exercise } from "../../../components/types";
import ExerciseCard from "../../../components/card/ExerciseCard";
import { useTheme } from "@rneui/themed";

function AddExerciseScreen() {
  const [imageUrls, setImageUrls] = useState([]);
  const { exerciseId, planId, route, workoutTime } = useLocalSearchParams();
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
    try {
      const dayDoc = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}`
      );
      const exerciseCollection = collection(dayDoc, "Exercise");

      const exercisesSnapshot = await getDocs(exerciseCollection);
      const exercises = exercisesSnapshot.docs.map(
        (doc) => doc.data() as Exercise
      );

      const existingExercise = exercises.find(
        (ex) => ex.name === exercise.name
      );
      if (existingExercise) {
        Alert.alert("Cannot Add", "Exercise already exists");
        return;
      }

      const nextIndex =
        exercises.length > 0
          ? Math.max(...exercises.map((ex) => ex.index)) + 1
          : 0;

      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Exercise/${exercise.id}`
      );
      await setDoc(exerciseDocRef, {
        id: exercise.id,
        name: exercise.name,
        planId: planId,
        sets: [{ reps: 0, weight_duration: 0 }],
        cardio: exercise.category === "cardio",
        index: nextIndex,
      });

      if (workoutTime != null) {
        router.push({
          pathname: "/(tabs)/(workout)/workout",
          params: {
            planId: planId,
            workoutTime: workoutTime,
          },
        });
      } else {
        router.push({
          pathname: "/(tabs)/(workout)/plan",
          params: {
            planId: planId,
          },
        });
      }
    } catch (error) {
      console.error("Error adding new exercise:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: Platform.OS == "ios" ? 85 : 0,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {exercise && (
          <View>
            <ExerciseCard
              exercise={exercise}
              imageUrls={imageUrls}
              route={route}
              handleAddExercise={handleAddExercise}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

export default AddExerciseScreen;
