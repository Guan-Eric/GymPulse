import React from "react";
import { View, Text, Appearance, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

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
export default ExerciseScreen;
