import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  Button,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";

function SignUpScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a2a", "#111111"]}
        style={styles.background}
        start={{ x: 1, y: 0 }}
      >
        <SafeAreaView style={styles.content}>
          <Text style={styles.titleText}>Sign Up</Text>
          <Text style={styles.baseText}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(email) => onChangeEmail(email)}
            value={email}
            autoCapitalize="none"
          />
          <Text style={styles.baseText}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(password) => onChangePassword(password)}
            value={password}
            secureTextEntry={true}
            autoCapitalize="none"
          />
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Button title="Sign Up" onPress={signUp} />
          )}
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
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  titleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  baseText: {
    color: "white",
  },
  input: {
    color: "white",
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
  },
});

export default SignUpScreen;
