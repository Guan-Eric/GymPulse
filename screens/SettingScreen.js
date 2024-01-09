import React from "react";
import { Text, View, StyleSheet, Button, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

function SettingScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text>SettingScreen</Text>
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log Out" />
      </SafeAreaView>
    </View>
  );
}

export default SettingScreen;
