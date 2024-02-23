import { useTheme } from "@rneui/themed";
import React, { useState } from "react";
import { Button } from "@rneui/themed";
import { SafeAreaView, View, Image, Text, StyleSheet } from "react-native";

function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <SafeAreaView>
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

        <Button
          size="lg"
          buttonStyle={styles.signUpButton}
          title="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
        />
        <Button
          type="clear"
          title="Sign In"
          onPress={() => navigation.navigate("SignIn")}
        />
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  sloganText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Lato_700Bold",
  },
  logoText: {
    fontSize: 64,
    fontFamily: "Roboto_700Bold",
    color: "#3490de",
  },
  signUpButton: {
    fontFamily: "Lato_700Bold",
    borderRadius: 15,
    width: 200,
  },
});
export default WelcomeScreen;
