import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { router } from "expo-router";
import { logIn } from "../../backend/auth";

function SignInScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    if (logIn(email, password)) setLoading(false);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
          <Image
            style={{
              resizeMode: "contain",
              height: 100,
              width: 250,
            }}
            source={require("../../assets/newLogo.png")}
          />
          <Text style={styles.titleText}>Sign In</Text>
          <View>
            <Input
              style={styles.input}
              placeholder="E-mail Address"
              onChangeText={(email) => onChangeEmail(email)}
              autoCapitalize="none"
            />
            <Input
              style={styles.input}
              placeholder="Password"
              onChangeText={(password) => onChangePassword(password)}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          {loading ? (
            <Button buttonStyle={styles.signInButton} loading />
          ) : (
            <Button
              buttonStyle={styles.signInButton}
              title="Sign In"
              onPress={signIn}
            />
          )}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.baseText}>Already have an account?</Text>
            <Button
              type="clear"
              buttonStyle={styles.signUpButton}
              title="Sign Up"
              onPress={() => router.push("/(auth)/presignup")}
            />
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
  },
  baseText: {
    fontFamily: "Alata_400Regular",
    color: "gray",
    fontSize: 15,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Lato_700Bold",
  },
  signInButton: {
    fontFamily: "Lato_700Bold",
    borderRadius: 15,
    alignSelf: "center",
    width: 200,
  },
  signUpButton: {
    width: 100,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Alata_400Regular",
    fontSize: 20,
    width: 24,
  },
});
export default SignInScreen;
