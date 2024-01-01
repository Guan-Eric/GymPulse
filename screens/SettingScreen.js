import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function SettingScreen(props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a2a", "#111111"]}
        style={styles.background}
        start={{ x: 1, y: -0.5 }}
      >
        <Text>SettingScreen</Text>
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

export default SettingScreen;
