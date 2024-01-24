import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Pressable,
  Text,
  Image,
  Appearance,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, getDocs, onSnapshot, where } from "firebase/firestore";

function SearchExerciseScreen({ navigation, route }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [search, setSearch] = useState("");
  const [exercises, setExecercises] = useState([]);
  useEffect(() => {
    const fetchExerciseFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(FIRESTORE_DB, "Exercises")
        );
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setExecercises(data);
        console.log("data retreived");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchExerciseFromFirestore();
  }, []);
  const filteredExercises = exercises.filter((item) => {
    if (search.length > 0) {
      return item.name.toLowerCase().includes(search.toLowerCase());
    } else {
      return false;
    }
  });
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={(text) => setSearch(text)}
          onClear={() => setSearch("")}
          value={search}
        />
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
          renderItem={({ item }) => (
            <Pressable
              key={item.key}
              onPress={() =>
                navigation.navigate("AddExercise", {
                  exercise: item,
                  userId: route.params.userId,
                  dayId: route.params.dayId,
                  planId: route.params.planId,
                })
              }
            >
              <Text style={styles.baseText}>{item.name}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

export default SearchExerciseScreen;
