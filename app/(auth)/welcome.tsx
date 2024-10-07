import React from "react";
import { Button } from "@rneui/themed";
import { SafeAreaView, View, Image, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              resizeMode: "contain",
              height: 100,
              width: 250,
            }}
            source={require("../../assets/newLogo.png")}
          />
          <Text style={styles.logoText}>GymPulse</Text>
          <Text style={styles.sloganText}>Power Up Your Fitness</Text>
        </View>
        <View>
          <Button
            size="lg"
            buttonStyle={styles.signUpButton}
            title="Sign Up"
            onPress={() => router.push("/(auth)/presignup")}
          />

          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <Text style={styles.baseText}>Already have an account?</Text>

            <Button
              type="clear"
              buttonStyle={styles.signInButton}
              titleStyle={{ fontFamily: "Alata_400Regular", fontSize: 15 }}
              title="Sign In"
              onPress={() => router.push("/(auth)/signin")}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "space-around",
  },
  sloganText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Alata_400Regular",
  },
  logoText: {
    fontSize: 64,
    fontFamily: "Anton_400Regular",
    color: "#3490de",
  },
  baseText: {
    fontFamily: "Alata_400Regular",
    color: "gray",
    fontSize: 15,
  },
  signUpButton: {
    fontFamily: "Alata_400Regular",
    fontSize: 20,
    borderRadius: 20,
    width: 240,
    height: 46,
  },
  signInButton: { width: 100 },
});
export default WelcomeScreen;
