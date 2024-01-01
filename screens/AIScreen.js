import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";

function AIScreen(props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a2a", "#111111"]}
        style={styles.background}
        start={{ x: 1, y: -0.5 }}
      >
        <SafeAreaView style={styles.container}>
          <Text>Create Your Plan</Text>
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});

export default AIScreen;
