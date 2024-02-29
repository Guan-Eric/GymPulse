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
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { collection, getDocs, onSnapshot, where } from "firebase/firestore";
import { useThemeMode } from "@rneui/themed";
import { Exercise } from "../../components/types";

function SearchExerciseScreen({ navigation, route }) {
  const { mode, setMode } = useThemeMode();
  const [search, setSearch] = useState("");
  const [exercises, setExecercises] = useState<Exercise[]>([]);
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
          lightTheme={mode == "light"}
        />
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
          renderItem={({ item }) => (
            <Pressable
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
export default SearchExerciseScreen;
