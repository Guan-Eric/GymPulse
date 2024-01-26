import React from "react";
import { View, Text, Appearance, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/Theme";

function ExerciseScreen({ route }) {
  const exercise = route.params.item;
  const instructions = exercise.instructions.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  const secondaryMuscles = exercise.secondaryMuscles.map((item, index) => (
    <Text key={index}>{item}</Text>
  ));
  return (
    <View>
      <SafeAreaView>
        <Image
          source={{ uri: exercise.images[0] }}
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

export default ExerciseScreen;
