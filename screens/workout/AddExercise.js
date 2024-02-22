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
import { FIRESTORE_DB } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_STR } from "../../firebaseConfig";
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
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const image1Ref = ref(
          FIREBASE_STR,
          `assets/${route.params.exercise.id}_0.jpg`
        );
        const url1 = await getDownloadURL(image1Ref);
        const image2Ref = ref(
          FIREBASE_STR,
          `assets/${route.params.exercise.id}_1.jpg`
        );
        const url2 = await getDownloadURL(image2Ref);
        setImageUrls([
          { id: 0, uri: url1 },
          { id: 1, uri: url2 },
        ]);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);
  const instructions = route.params.exercise.instructions.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const secondaryMuscles = route.params.exercise.secondaryMuscles.map(
    (item, index) => <Text key={index}>{item}</Text>
  );
  const handleAddExercise = async () => {
    const dayDoc = doc(
      FIRESTORE_DB,
      `Users/${route.params.userId}/Plans/${route.params.planId}/Days/${route.params.dayId}`
    );
    const exerciseCollection = collection(dayDoc, "Exercise");
    const exerciseDocRef = await addDoc(exerciseCollection, {
      name: route.params.exercise.name,
      dayId: route.params.dayId,
      sets: [{ reps: 0, weight_duration: 0 }],
      cardio: route.params.exercise.category == "cardio",
    });
    const exerciseDoc = doc(exerciseCollection, exerciseDocRef.id);
    await updateDoc(exerciseDoc, { id: exerciseDoc.id });
    navigation.goBack();
    navigation.goBack();
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
          <Text>{route.params.exercise.name}</Text>
          <Button title="Add Exercise" onPress={handleAddExercise} />
          <Text>Equipment</Text>
          <Text>{route.params.exercise.equipment}</Text>
          <Text>Secondary Muscles</Text>
          {secondaryMuscles}
          <Text>Level</Text>
          <Text>{route.params.exercise.level}</Text>
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
