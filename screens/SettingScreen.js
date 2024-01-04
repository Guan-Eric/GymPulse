import React from "react";
import { Text, View, StyleSheet, Button, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { FIREBASE_AUTH } from "../firebaseConfig";

function SettingScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  return (
    <View style={styles.container}>
      <Text>SettingScreen</Text>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log Out" />
    </View>
  );
}

export default SettingScreen;
