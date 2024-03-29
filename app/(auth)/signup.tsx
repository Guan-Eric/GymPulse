import React, { useState } from "react";
import { View, SafeAreaView, Text, Image } from "react-native";
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Input } from "@rneui/themed";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { router } from "expo-router";

function SignUpScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.titleText}>Sign Up</Text>
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
            <Button buttonStyle={styles.signUpButton} loading />
          ) : (
            <Button
              buttonStyle={styles.signUpButton}
              title="Sign Up"
              onPress={signUp}
            />
          )}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.baseText}>Already have an account?</Text>
            <Button
              type="clear"
              buttonStyle={styles.signInButton}
              title="Sign In"
              onPress={() => router.push("/(auth)/signin")}
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
    color: "gray",
    fontSize: 15,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
  },
  signUpButton: {
    borderRadius: 15,
    alignSelf: "center",
    width: 200,
  },
  signInButton: {
    width: 100,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontSize: 20,
  },
});
export default SignUpScreen;
