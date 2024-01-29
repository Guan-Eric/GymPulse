import { useTheme } from "@rneui/themed";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  Button,
  Appearance,
  StyleSheet,
} from "react-native";

function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={styles.container}>
        <Image
          style={{
            resizeMode: "contain",
            height: 50,
            width: 50,
          }}
          source={require("../assets/logo.png")}
        />
        <Text style={styles.logoText}>FitAI</Text>
        <Text style={styles.baseText}>Your Personal Trainer</Text>
        <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
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
export default WelcomeScreen;
