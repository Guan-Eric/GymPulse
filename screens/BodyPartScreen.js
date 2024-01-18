import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Appearance,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

function BodyPartScreen({ route, navigation }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [exercises, setExercises] = useState([]);
  const bodyPart = route.params.item.name.toLowerCase();

  const fetchExerciseFromFirestore = async () => {
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
      });

      setExercises(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  useEffect(() => {
    if (exercises.length < 1) fetchExerciseFromFirestore();
  });
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.baseText}>{route.params.item.name}</Text>
        <View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
          >
            {exercises.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => navigation.navigate("Exercise", { item })}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={{
                    resizeMode: "cover",
                    height: 150,
                    width: 150,
                  }}
                />
                <Text style={styles.baseText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default BodyPartScreen;
