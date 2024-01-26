import React from "react";
import { Text, View, SafeAreaView, Pressable, Appearance } from "react-native";
import { theme } from "../styles/Theme";

function AIScreen() {
  return (
    <View style={theme.container}>
      <SafeAreaView style={theme.container}>
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
