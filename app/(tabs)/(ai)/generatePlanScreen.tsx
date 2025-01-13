import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Plan } from "../../../components/types";
import { Button, Input } from "@rneui/themed";
import { generatePlan } from "../../../backend/ai";

export default function GeneratePlanScreen() {
  const [plan, setPlan] = useState<Plan>(null);
  const [goal, setGoal] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [days, setDays] = useState<number>(1);

  const handleGeneratePlan = async () => {
    setPlan(await generatePlan(days, level, goal, preference));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Your Workout Plan</Text>
      <Input
        style={styles.input}
        label="Enter your goal"
        placeholder="e.g weight loss, muscle gain"
        value={goal}
        onChangeText={setGoal}
      />
      <Input
        style={styles.input}
        label="Workout preference"
        placeholder="e.g. cardio, strength, flexibility"
        value={preference}
        onChangeText={setPreference}
      />
      <Input
        style={styles.input}
        label="Fitness level"
        placeholder="e.g. beginner, intermediate, advanced"
        value={level}
        onChangeText={setLevel}
      />
      <Input
        style={styles.input}
        keyboardType="numeric"
        label="Frequency (days per week)"
        value={days.toString()}
        onChangeText={(text) => setDays(Number(text))}
      />
      <Button
        disabled={goal && preference && level ? false : true}
        title="Generate Plan"
        onPress={handleGeneratePlan}
      />
      {plan && (
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>Your Plan:</Text>
          {plan.exercises.map((item, index) => (
            <Text key={index}>{item.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20 },
  planContainer: { marginTop: 20 },
  planTitle: { fontSize: 18, fontWeight: "bold" },
});
