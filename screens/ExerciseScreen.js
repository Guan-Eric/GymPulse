import React, { useEffect, useState } from "react";
import { Text, View, Pressable, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchExerciseByBodyPart } from "../apis/exerciseDB";

function ExerciseScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [exercises, setExercises] = useState([]);
  const item = useLocalSearchParams();
  useEffect(() => {
    if (item) getExercises(item.name);
  }, [item]);

  const getExercises = async (bodyPart) => {
    let data = await fetchExerciseByBodyPart(bodyPart);
    console.log(data);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.baseText}>Exercise</Text>
      </SafeAreaView>
    </View>
  );
}
[
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];
export default ExerciseScreen;
