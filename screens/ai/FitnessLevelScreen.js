import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
} from "react-native";

function FitnessLevelScreen({ navigation, route }) {
  const [fitness, setFitness] = useState("");
  return (
    <View>
      <SafeAreaView>
        <Text>What is your fitness level?</Text>
        <Pressable onPress={() => setFitness("beginner")}>
          <Text style={fitness == "beginner" ? styles.pressed : {}}>
            Beginner
          </Text>
        </Pressable>
        <Pressable onPress={() => setFitness("intermediate")}>
          <Text style={fitness == "intermediate" ? styles.pressed : {}}>
            Intermediate
          </Text>
        </Pressable>
        <Pressable onPress={() => setFitness("advanced")}>
          <Text style={fitness == "advanced" ? styles.pressed : {}}>
            Advanced
          </Text>
        </Pressable>
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate("Height", {
              gender: route.params.gender,
              goal: route.params.goal,
              fitness: fitness,
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}

export default FitnessLevelScreen;

const styles = StyleSheet.create({
  pressed: {
    color: "#3490de",
  },
});
