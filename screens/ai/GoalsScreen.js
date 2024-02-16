import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Button } from "react-native";
import { CheckBox } from "@rneui/themed";
function GoalsScreen({ navigation, route }) {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const handleGoalToggle = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((item) => item !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <CheckBox
          title="Build Muscle"
          checked={selectedGoals.includes("build muscle")}
          onPress={() => handleGoalToggle("build muscle")}
        />
        <CheckBox
          title="Burn Fat"
          checked={selectedGoals.includes("burn fat")}
          onPress={() => handleGoalToggle("burn fat")}
        />
        <CheckBox
          title="Increase Endurance"
          checked={selectedGoals.includes("increase endurance")}
          onPress={() => handleGoalToggle("increase endurance")}
        />
        <CheckBox
          title="Agility"
          checked={selectedGoals.includes("agility")}
          onPress={() => handleGoalToggle("agility")}
        />
        <CheckBox
          title="Weight Loss"
          checked={selectedGoals.includes("weight loss")}
          onPress={() => handleGoalToggle("weight loss")}
        />
        <CheckBox
          title="Flexibility"
          checked={selectedGoals.includes("flexibility")}
          onPress={() => handleGoalToggle("flexibility")}
        />
        <CheckBox
          title="Reduce Back Pain"
          checked={selectedGoals.includes("reduce back pain")}
          onPress={() => handleGoalToggle("reduce back pain")}
        />
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate("FitnessLevel", {
              gender: route.params.gender,
              goal: selectedGoals,
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}

export default GoalsScreen;
