import React from "react";
import { Text, View, SafeAreaView, Pressable, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";

function AIScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>Create Your Plan with AI</Text>
        <Text>Choose your fitness level</Text>
        <Pressable>
          <Text>Beginner</Text>
        </Pressable>
        <Pressable>
          <Text>Intermediate</Text>
        </Pressable>
        <Pressable>
          <Text>Advanced</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

export default AIScreen;
