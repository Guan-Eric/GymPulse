import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  Appearance,
} from "react-native";
import { theme } from "../styles/Theme";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";

function SignUpScreen() {
  const [styles, setSetyles] = useState(
    Appearance.getColorScheme() == "light" ? styles.lightMode : styles.darkMode
  );
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
      console.log(error);
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

export default SignUpScreen;
