import React from "react";
import { SafeAreaView, TextInput } from "react-native";

function SignInScreen(props) {
  <SafeAreaView style={styles.container}>
    <Text>Sign In</Text>
    <TextInput></TextInput>
    <TextInput></TextInput>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  baseText: {
    color: "white",
  },
});
export default SignInScreen;
