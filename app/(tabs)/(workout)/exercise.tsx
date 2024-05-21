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

function ExerciseScreen() {
  const [imageUrls, setImageUrls] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const { exerciseId } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();

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

  const instructions = exercise?.instructions.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const secondaryMuscles = exercise?.secondaryMuscles.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          horizontal={true}
          data={imageUrls}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image
              source={{
                uri: item.uri,
              }}
              style={{
                width: screenWidth,
                height: screenWidth,
                resizeMode: "cover",
              }}
            />
          )}
        />

        <ScrollView>
          <Text>{exercise.name}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ExerciseScreen;
