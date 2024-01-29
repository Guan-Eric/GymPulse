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
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";

function SignInScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Text style={styles.titleText}>Sign In</Text>
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
          <Button title="Sign In" onPress={signIn} />
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
export default SignInScreen;
