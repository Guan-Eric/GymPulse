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
import { FIRESTORE_DB, FIREBASE_STR } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";

function BodyPartScreen({ route, navigation }) {
  const [exercises, setExercises] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const bodyPart = route.params.item.name.toLowerCase();

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
        <Text style={styles.baseText}>{route.params.item.name}</Text>
        <FlatList
          data={exercises}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => navigation.navigate("Exercise", { item })}
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
