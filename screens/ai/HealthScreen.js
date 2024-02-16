import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Button } from "react-native";
import { CheckBox } from "@rneui/themed";

function HealthScreen({ route }) {
  const [healthIssues, setHealthIssues] = useState([]);

  const handleHealthToggle = (issue) => {
    if (healthIssues.includes(issue)) {
      setHealthIssues(healthIssues.filter((item) => item !== issue));
    } else {
      setHealthIssues([...healthIssues, issue]);
    }
  };

  const generateWorkoutPlan = () => {
    // Here you would implement the logic to generate a workout plan
    // based on the user's input, including goals, height, weight,
    // equipment, frequency, gender, and health issues.
    console.log("Generating workout plan...");
    console.log("Goals:", route.params.goal);
    console.log("Height:", route.params.height);
    console.log("Weight:", route.params.weight);
    console.log("Equipment:", route.params.equipment);
    console.log("Frequency:", route.params.frequency);
    console.log("Gender:", route.params.gender);
    console.log("Health Issues:", healthIssues);
    // Navigate to the next screen or perform any other action
  };

  return (
    <View>
      <SafeAreaView>
        <CheckBox
          title="Knee pain"
          checked={healthIssues.includes("knee")}
          onPress={() => handleHealthToggle("knee")}
        />
        <CheckBox
          title="Back pain or Hernia"
          checked={healthIssues.includes("back")}
          onPress={() => handleHealthToggle("back")}
        />
        <CheckBox
          title="Arms/Shoulders pain"
          checked={healthIssues.includes("arms")}
          onPress={() => handleHealthToggle("arms")}
        />
        <CheckBox
          title="Hip joint pain"
          checked={healthIssues.includes("hip")}
          onPress={() => handleHealthToggle("hip")}
        />
        <CheckBox
          title="Can't do jumps"
          checked={healthIssues.includes("jump")}
          onPress={() => handleHealthToggle("jump")}
        />
        <Button title="Create Plan" onPress={generateWorkoutPlan} />
      </SafeAreaView>
    </View>
  );
}

export default HealthScreen;
