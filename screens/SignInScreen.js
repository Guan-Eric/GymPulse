import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  Appearance,
} from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";

function SignInScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
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

export default SignInScreen;
