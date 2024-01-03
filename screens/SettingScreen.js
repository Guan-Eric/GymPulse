import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FIREBASE_AUTH } from "../firebaseConfig";

function SettingScreen(props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a2a", "#111111"]}
        style={styles.background}
        start={{ x: 1, y: -0.5 }}
      >
        <Text>SettingScreen</Text>
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log Out" />
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
