import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Input, Switch } from "@rneui/themed";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { isUsernameExists } from "../../backend/user";

const sexOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

function PreSignUpScreen() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isMetric, setIsMetric] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDiasabled] = useState(true);

  const handleNext = () => {
    router.push({
      pathname: "/signup",
      params: {
        username,
        name,
        height,
        weight,
        isMetric: isMetric.toString(),
      },
    });
  };

  useEffect(() => {
    setIsButtonDiasabled(!(isUsernameValid && name && height && weight));
    console.log(isButtonDisabled);
  }, [username, name, height, weight]);

  const checkUsername = async (username: string) => {
    setUsername(username);
    if (username.length > 3) {
      const exists = await isUsernameExists(username);
      setIsUsernameValid(!exists);
      setUsernameErrorMessage(exists ? "Username is already taken." : "");
    } else {
      setIsUsernameValid(false);
      setUsernameErrorMessage("Username must be at least 4 characters long.");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.titleText}>Sign Up</Text>
          <View>
            <Input
              containerStyle={styles.inputContainer}
              style={styles.input}
              placeholder="Username"
              onChangeText={(text) => checkUsername(text)}
              autoCapitalize="none"
            />
            {usernameErrorMessage ? (
              <Text style={styles.errorText}>{usernameErrorMessage}</Text>
            ) : null}
            <Input
              containerStyle={styles.inputContainer}
              style={styles.input}
              placeholder="Name"
              onChangeText={(text) => setName(text)}
            />
            <Input
              containerStyle={styles.inputContainer}
              style={styles.input}
              placeholder={isMetric ? "Height (cm)" : "Height (in)"}
              keyboardType="numeric"
              onChangeText={(text) => setHeight(text)}
            />
            <Input
              containerStyle={styles.inputContainer}
              style={styles.input}
              placeholder={isMetric ? "Weight (kg)" : "Weight (lbs)"}
              keyboardType="numeric"
              onChangeText={(text) => setWeight(text)}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Use Metric Units</Text>
              <Switch
                value={isMetric}
                onValueChange={(value) => setIsMetric(value)}
              />
            </View>
          </View>
          <Button
            buttonStyle={[
              styles.nextButton,
              { opacity: isButtonDisabled ? 0.5 : 1 },
            ]}
            title="Next"
            onPress={handleNext}
            disabled={isButtonDisabled}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Lato_700Bold",
  },
  nextButton: {
    fontFamily: "Lato_700Bold",
    borderRadius: 15,
    alignSelf: "center",
    width: 200,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 20,
  },
  inputContainer: {
    width: 300,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  switchLabel: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_400Regular",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginLeft: 10,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "Lato_400Regular",
  },
});

export default PreSignUpScreen;
