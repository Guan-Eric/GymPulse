import React from "react";
import { Text, View, Pressable, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

function PlanScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>Your Plan</Text>
      </SafeAreaView>
    </View>
  );
}

export default PlanScreen;
