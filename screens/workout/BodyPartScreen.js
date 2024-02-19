import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Appearance,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

function BodyPartScreen({ route, navigation }) {
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
                <Text style={styles.baseText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
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
export default BodyPartScreen;