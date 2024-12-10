import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Icon, Input } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { router } from "expo-router";
import { logIn } from "../../backend/auth";
import BackButton from "../../components/BackButton";

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
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <BackButton />
            <View style={styles.content}>
              <View style={{ alignItems: "center", paddingBottom: 84 }}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/newLogo.png")}
                />
                <Text style={styles.titleText}>Sign In</Text>
              </View>
              <View style={{ paddingBottom: 96 }}>
                <Input
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                  containerStyle={styles.inputContainer}
                  style={styles.input}
                  placeholder="E-mail"
                  onChangeText={(email) => onChangeEmail(email)}
                  autoCapitalize="none"
                />
                <View style={{ paddingTop: 25 }}>
                  <Input
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={styles.inputContainer}
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={(password) => onChangePassword(password)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                  />
                </View>
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
              <View style={{ alignItems: "center", paddingTop: 20 }}>
                <Text style={styles.baseText}>Already have an account?</Text>
                <Button
                  type="clear"
                  titleStyle={styles.signUp}
                  buttonStyle={styles.signUpButton}
                  title="Sign Up"
                  onPress={() => router.push("/(auth)/presignup")}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  signInButton: {
    fontFamily: "Alata_400Regular",
    borderRadius: 20,
    width: 240,
    height: 42,
  },
  signUpButton: {
    width: 100,
  },
  signUp: { fontFamily: "Alata_400Regular", fontSize: 16 },
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
export default SignInScreen;
