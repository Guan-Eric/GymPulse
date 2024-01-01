import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a2a", "#111111"]}
        style={styles.background}
        start={{ x: 1, y: -0.5 }}
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
          <Button
            title="Sign In"
            onPress={() => navigation.navigate("SignIn")}
          />
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("SignUp")}
          />
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
  baseText: {
    color: "white",
    fontSize: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoText: {
    color: "#3490de",
    fontSize: 50,
  },
});

export default WelcomeScreen;
