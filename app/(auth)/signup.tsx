import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Input } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { register } from "../../backend/auth";

function SignUpScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { username, name, height, weight, cmIsMetric, kgIsMetric } =
    useLocalSearchParams();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    } else if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    } else if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    } else if (!hasNumber) {
      return "Password must contain at least one number.";
    } else if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    } else {
      return "";
    }
  };

  const signUp = async () => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      setLoading(false);
      return;
    }

    if (
      await register(
        email,
        password,
        username as string,
        name as string,
        height as string,
        weight as string,
        cmIsMetric as string,
        kgIsMetric as string
      )
    ) {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={styles.content}>
            <Image
              style={styles.logo}
              source={require("../../assets/newLogo.png")}
            />
            <Text style={styles.titleText}>Sign Up</Text>
            <View>
              <Input
                style={styles.input}
                placeholder="E-mail Address"
                value={email}
                onChangeText={(email) => onChangeEmail(email)}
                autoCapitalize="none"
                placeholderTextColor="gray"
                inputStyle={styles.inputText}
                errorMessage={emailError}
                errorStyle={styles.errorText}
              />
              <Input
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(password) => onChangePassword(password)}
                secureTextEntry={true}
                autoCapitalize="none"
                placeholderTextColor="gray"
                inputStyle={styles.inputText}
                errorMessage={passwordError}
                errorStyle={styles.errorText}
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
        </KeyboardAvoidingView>
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
  logo: {
    resizeMode: "contain",
    height: 100,
    width: 250,
    alignSelf: "center",
  },
  baseText: {
    fontFamily: "Lato_400Regular",
    color: "gray",
    fontSize: 15,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Lato_700Bold",
  },
  signUpButton: {
    fontFamily: "Lato_700Bold",
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
    fontFamily: "Lato_400Regular",
    fontSize: 20,
  },
  inputText: {
    color: "white",
    fontFamily: "Lato_400Regular",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
});

export default SignUpScreen;
