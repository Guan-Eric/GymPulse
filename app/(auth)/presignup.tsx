import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Input, Switch } from "@rneui/themed";
import { router } from "expo-router";
import { isUsernameExists } from "../../backend/user";

const PreSignUpScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [isMetric, setIsMetric] = useState<boolean>(true);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const unitHeight = isMetric ? " cm" : " in";
  const unitWeight = isMetric ? " kg" : " lbs";

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
    setIsButtonDisabled(
      !(
        isUsernameValid &&
        name &&
        validateDecimal(height) &&
        validateDecimal(weight)
      )
    );
  }, [username, name, height, weight]);

  const validateDecimal = (value: string) => {
    const decimalPattern = /^\d+(\.\d{0,2})?$/;
    return decimalPattern.test(value) && value !== "";
  };

  const handleHeightChange = (text: string) => {
    const processedText = text.replace(/^0+(?!\.|$)/, ""); // Remove leading zeros
    if (validateDecimal(processedText) || processedText === "") {
      setHeight(processedText);
    }
  };

  const handleWeightChange = (text: string) => {
    const processedText = text.replace(/^0+(?!\.|$)/, ""); // Remove leading zeros
    if (validateDecimal(processedText) || processedText === "") {
      setWeight(processedText);
    }
  };

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
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
              <View style={styles.inputWithUnitContainer}>
                <Input
                  containerStyle={styles.inputContainer}
                  style={styles.inputWithUnit}
                  placeholder="Height"
                  keyboardType="numeric"
                  onChangeText={handleHeightChange}
                  value={height}
                  errorMessage={
                    height && !validateDecimal(height) ? "Invalid height" : ""
                  }
                />
                <Text style={styles.unitText}>{unitHeight}</Text>
              </View>
              <View style={styles.inputWithUnitContainer}>
                <Input
                  containerStyle={styles.inputContainer}
                  style={styles.inputWithUnit}
                  placeholder="Weight"
                  keyboardType="numeric"
                  onChangeText={handleWeightChange}
                  value={weight}
                  errorMessage={
                    weight && !validateDecimal(weight) ? "Invalid weight" : ""
                  }
                />
                <Text style={styles.unitText}>{unitWeight}</Text>
              </View>
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
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

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
  inputWithUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithUnit: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 20,
  },
  unitText: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
    fontFamily: "Lato_400Regular",
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
