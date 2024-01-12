import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Appearance,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";

function ExerciseScreen({ route }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const exercise = route.params.item;

  return (
    <View>
      <Image
        source={require("../assets/" + exercise.id + "0.jpg")}
        style={{
          resizeMode: "cover",
          height: 150,
          width: 150,
        }}
      />
      <ScrollView>
        <Text>{exercise.name}</Text>
        <Text>Equipment</Text>
        <Text>{exercise.equipment}</Text>
        <Text>Secondary Muscles</Text>
        <Text>{exercise?.secondaryMuscles}</Text>
        <Text>Level</Text>
        <Text>{exercise.level}</Text>
        <Text>Instructions</Text>
        <Text>{exercise.instructions}</Text>
      </ScrollView>
    </View>
  );
}

export default ExerciseScreen;
