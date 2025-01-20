import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Exercise } from "../../../components/types";
import { Button, Input, useTheme } from "@rneui/themed";
import { fetchSuggestions } from "../../../backend/ai";

export default function SuggestExerciseScreen() {
  const [suggestions, setSuggestions] = useState<Exercise[]>([]);
  const [bodyPart, setBodyPart] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const { theme } = useTheme();

  const handleSuggestExercises = async () => {
    setSuggestions(await fetchSuggestions(bodyPart, goal, preference));
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <Text style={styles.title}>Exercise Suggestions</Text>
        <Input
          style={styles.input}
          label="Enter body part"
          placeholder="e.g. legs, arms"
          value={bodyPart}
          onChangeText={setBodyPart}
        />

        <Input
          style={styles.input}
          label="What is your goal?"
          placeholder="e.g. build muscle, lose weight, athleticism"
          value={goal}
          onChangeText={setGoal}
        />
        <Input
          style={styles.input}
          label="Enter your exercise preference"
          placeholder="e.g. cardio, strength, flexibility"
          value={preference}
          onChangeText={setPreference}
        />
        <Button
          disabled={bodyPart && goal ? false : true}
          title="Get Suggestions"
          onPress={handleSuggestExercises}
        />
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20 },
});
