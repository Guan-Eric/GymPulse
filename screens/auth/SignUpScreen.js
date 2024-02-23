import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  Appearance,
} from "react-native";
import { StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
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
    } catch (error) {
      console.error(error);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
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
export default SignUpScreen;
