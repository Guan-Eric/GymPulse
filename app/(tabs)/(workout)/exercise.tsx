import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_STR, FIRESTORE_DB } from "../../../firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { Exercise } from "../../../components/types";
import { getDoc, doc } from "firebase/firestore";
import ExerciseCard from "../../../components/ExerciseCard";
import { useTheme } from "@rneui/themed";

function ExerciseScreen() {
  const [imageUrls, setImageUrls] = useState([]);
  const { exerciseId } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();

  const { theme } = useTheme();

  useEffect(() => {
    const fetchImages = async () => {
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
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        {exercise && <ExerciseCard exercise={exercise} imageUrls={imageUrls} />}
      </SafeAreaView>
    </View>
  );
}

export default ExerciseScreen;
