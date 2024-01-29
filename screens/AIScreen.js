import React from "react";
import { Text, View, SafeAreaView, Pressable, Appearance } from "react-native";
import { StyleSheet } from "react-native";

function AIScreen() {
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
export default AIScreen;
