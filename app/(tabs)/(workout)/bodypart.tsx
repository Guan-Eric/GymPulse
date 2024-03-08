import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_STR } from "../../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Exercise } from "../../../components/types";
import { router, useLocalSearchParams } from "expo-router";

function BodyPartScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [imageUrls, setImageUrls] = useState({});
  const { bodypart } = useLocalSearchParams();

  const bodyPart = (bodypart as string).toLowerCase();

  const fetchExercisesFromFirestore = async () => {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const queryRef = query(
        collectionRef,
        where("primaryMuscles", "array-contains", bodyPart)
      );
      const querySnapshot = await getDocs(queryRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
        fetchImage(doc.data().id);
      });
      setExercises(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  const fetchImage = async (id) => {
    try {
      const imageRef = ref(FIREBASE_STR, `assets/${id}_0.jpg`);
      const url = await getDownloadURL(imageRef);
      setImageUrls((prevImageUrls) => ({
        ...prevImageUrls,
        [id]: url,
      }));
    } catch (error) {
      console.error("Error getting image URL:", error);
    }
  };

  useEffect(() => {
    fetchExercisesFromFirestore();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.baseText}>{bodyPart}</Text>
        <FlatList
          data={exercises}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/exercise",
                    params: { exerciseId: item.id },
                  })
                }
              >
                <Image
                  source={{ uri: imageUrls[item.id] }}
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: "cover",
                  }}
                />
                <Text style={styles.baseText}>{item.name}</Text>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default BodyPartScreen;
