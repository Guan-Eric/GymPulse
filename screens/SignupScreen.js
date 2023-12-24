import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  Button,
} from "react-native";

function SignUpScreen({ navigation }) {
  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2a2a2a", "#111111"]}
        style={styles.background}
        start={{ x: 1, y: 0 }}
      >
        <SafeAreaView style={styles.content}>
          <Text style={styles.titleText}>Sign Up</Text>
          <Text style={styles.baseText}>Username</Text>
          <TextInput
            style={styles.input}
            onChangeText={(username) => onChangeUsername(username)}
            value={username}
          />
          <Text style={styles.baseText}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(password) => onChangePassword(password)}
            value={password}
            secureTextEntry={true}
          />
          <Button title="Sign In" onPress={() => navigation.navigate("Home")} />
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
