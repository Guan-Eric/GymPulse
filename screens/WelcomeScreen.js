import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  Button,
  Appearance,
} from "react-native";
import { theme } from "../styles/Theme";

function WelcomeScreen({ navigation }) {
  const [styles, setSetyles] = useState(
    Appearance.getColorScheme() == "light" ? theme.lightMode : theme.darkMode
  );
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Image
          style={{
            resizeMode: "contain",
            height: 50,
            width: 50,
          }}
          source={require("../assets/logo.png")}
        />
        <Text style={styles.logoText}>FitAI</Text>
        <Text style={styles.baseText}>Your Personal Trainer</Text>
        <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </SafeAreaView>
    </View>
  );
}

export default WelcomeScreen;
