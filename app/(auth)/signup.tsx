import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Icon, Input } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { register } from "../../backend/auth";
import BackButton from "../../components/BackButton";

function SignUpScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const {
    username,
    name,
    primaryHeight,
    secondaryHeight,
    weight,
    heightIsMetric,
    weightIsMetric,
  } = useLocalSearchParams();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password, confirmPassword) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    if (password !== confirmPassword) {
      return "Passwords must match.";
    }
    return "";
  };

  const signUp = async () => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      setLoading(false);
      return;
    }
    const passwordValidationMessage = validatePassword(
      password,
      confirmPassword
    );
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
        primaryHeight as string,
        secondaryHeight as string,
        weight as string,
        heightIsMetric as string,
        weightIsMetric as string
      )
    ) {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <BackButton />
            <View style={styles.content}>
              <View style={{ alignItems: "center", paddingBottom: 60 }}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/newLogo.png")}
                />
                <Text style={styles.titleText}>Sign Up</Text>
              </View>
              <View style={{ paddingBottom: 96 }}>
                <Input
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                  containerStyle={styles.inputContainer}
                  style={styles.input}
                  placeholder="E-mail"
                  value={email}
                  onChangeText={(email) => onChangeEmail(email)}
                  autoCapitalize="none"
                  placeholderTextColor="gray"
                  inputStyle={styles.inputText}
                  errorMessage={emailError}
                />
                <View style={{ paddingTop: 25 }}>
                  <Input
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={styles.inputContainer}
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                    inputStyle={styles.inputText}
                  />
                </View>
                <View style={{ paddingTop: 25 }}>
                  <Input
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={styles.inputContainer}
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(confirmPassword) =>
                      setConfirmPassword(confirmPassword)
                    }
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                    inputStyle={styles.inputText}
                    errorMessage={passwordError}
                  />
                </View>
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
              <View style={{ alignItems: "center", paddingTop: 20 }}>
                <Text style={styles.baseText}>Already have an account?</Text>
                <Button
                  type="clear"
                  titleStyle={styles.signIn}
                  buttonStyle={styles.signInButton}
                  title="Sign In"
                  onPress={() => router.push("/(auth)/signin")}
                />
              </View>
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
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    resizeMode: "contain",
    height: 100,
    width: 250,
    alignSelf: "center",
  },
  baseText: {
    fontFamily: "Alata_400Regular",
    color: "gray",
    fontSize: 16,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Alata_400Regular",
  },
  signUpButton: {
    fontFamily: "Alata_400Regular",
    borderRadius: 20,
    width: 240,
    height: 42,
  },
  signInButton: {
    width: 100,
  },
  signIn: { fontFamily: "Alata_400Regular", fontSize: 16 },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Alata_400Regular",
    fontSize: 14,
  },
  inputContainer: {
    width: 254,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
  },
  inputText: {
    color: "white",
    fontFamily: "Alata_400Regular",
    fontSize: 12,
  },
});

export default SignUpScreen;
