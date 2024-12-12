import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Button, Icon, Input, Switch } from "@rneui/themed";
import { router } from "expo-router";
import { isUsernameExists } from "../../backend/user";
import BackButton from "../../components/BackButton";

const PreSignUpScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [primaryHeight, setprimaryHeightUnit] = useState<string>("");
  const [secondaryHeight, setsecondaryHeightUnit] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [heightIsMetric, setheightIsMetric] = useState<boolean>(true);
  const [weightIsMetric, setweightIsMetric] = useState<boolean>(true);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const unitPrimaryHeight = heightIsMetric ? " cm" : " '";
  const unitSecondaryHeight = heightIsMetric ? "" : " ''";
  const unitWeight = weightIsMetric ? " kg" : " lbs";

  const handleNext = () => {
    router.push({
      pathname: "/signup",
      params: {
        username,
        name,
        primaryHeightUnit: primaryHeight,
        secondaryHeightUnit: secondaryHeight,
        weight,
        heightIsMetric: heightIsMetric.toString(),
        weightIsMetric: weightIsMetric.toString(),
      },
    });
  };

  useEffect(() => {
    setIsButtonDisabled(
      !(
        isUsernameValid &&
        name &&
        validateDecimal(primaryHeight) &&
        (validateDecimal(secondaryHeight) || heightIsMetric) &&
        validateDecimal(weight)
      )
    );
  }, [username, name, primaryHeight, secondaryHeight, weight, heightIsMetric]);

  const validateDecimal = (value: string) => {
    const decimalPattern = /^\d+(\.\d{0,2})?$/;
    return decimalPattern.test(value) && value !== "";
  };

  const handlePrimaryHeightChange = (text: string) => {
    const processedText = text.replace(/^0+(?!\.|$)/, ""); // Remove leading zeros
    if (validateDecimal(processedText) || processedText === "") {
      setprimaryHeightUnit(processedText);
    }
  };

  const handleSecondaryHeightChange = (text: string) => {
    const processedText = text.replace(/^0+(?!\.|$)/, ""); // Remove leading zeros
    if (validateDecimal(processedText) || processedText === "") {
      setsecondaryHeightUnit(processedText);
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
      setUsernameErrorMessage("Must be at least 4 characters long.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <BackButton />
            <View style={styles.content}>
              <View style={{ alignItems: "center", paddingBottom: 40 }}>
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 100,
                    width: 250,
                  }}
                  source={require("../../assets/newLogo.png")}
                />
                <Text style={styles.titleText}>Sign Up</Text>
              </View>
              <View style={{ paddingBottom: 70 }}>
                <Input
                  inputContainerStyle={styles.inputRoundedContainer}
                  containerStyle={styles.inputContainer}
                  style={styles.input}
                  label="Username"
                  onChangeText={(text) => checkUsername(text)}
                  autoCapitalize="none"
                  errorMessage={
                    usernameErrorMessage ? usernameErrorMessage : ""
                  }
                />

                <View style={{ paddingTop: 25 }}>
                  <Input
                    inputContainerStyle={styles.inputRoundedContainer}
                    containerStyle={styles.inputContainer}
                    style={styles.input}
                    label="Name"
                    onChangeText={(text) => setName(text)}
                  />
                </View>
                <View style={styles.inputWithUnitContainer}>
                  <View>
                    <View>
                      {heightIsMetric ? (
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Input
                            inputContainerStyle={styles.inputRoundedContainer}
                            containerStyle={styles.smallInputContainer}
                            style={styles.inputWithUnit}
                            label="Height"
                            keyboardType="numeric"
                            onChangeText={handlePrimaryHeightChange}
                            value={primaryHeight}
                            errorMessage={
                              primaryHeight && !validateDecimal(primaryHeight)
                                ? "Invalid height"
                                : ""
                            }
                          />
                          <Text style={styles.unitText}>
                            {unitPrimaryHeight}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Input
                            inputContainerStyle={styles.inputRoundedContainer}
                            containerStyle={styles.tinyInputContainer}
                            style={styles.inputWithUnit}
                            label="Height"
                            labelStyle={{ width: 200 }}
                            keyboardType="numeric"
                            onChangeText={handlePrimaryHeightChange}
                            value={primaryHeight}
                            errorMessage={
                              primaryHeight && !validateDecimal(primaryHeight)
                                ? "Invalid height"
                                : ""
                            }
                          />
                          <Text style={styles.unitText}>
                            {unitPrimaryHeight}
                          </Text>
                          <Input
                            inputContainerStyle={styles.inputRoundedContainer}
                            containerStyle={styles.tinyInputContainer}
                            style={styles.inputWithUnit}
                            label={" "}
                            keyboardType="numeric"
                            onChangeText={handleSecondaryHeightChange}
                            value={secondaryHeight}
                            errorMessage={
                              secondaryHeight &&
                              !validateDecimal(secondaryHeight)
                                ? "Invalid height"
                                : ""
                            }
                          />
                          <Text style={styles.unitText}>
                            {unitSecondaryHeight}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Switch
                    style={{ paddingTop: 14 }}
                    value={heightIsMetric}
                    onValueChange={(value) => setheightIsMetric(value)}
                  />
                </View>
                <View style={styles.inputWithUnitContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Input
                      inputContainerStyle={styles.inputRoundedContainer}
                      containerStyle={styles.smallInputContainer}
                      style={styles.inputWithUnit}
                      label="Weight"
                      keyboardType="numeric"
                      onChangeText={handleWeightChange}
                      value={weight}
                      errorMessage={
                        weight && !validateDecimal(weight)
                          ? "Invalid weight"
                          : ""
                      }
                    />
                    <Text style={styles.unitText}>{unitWeight}</Text>
                  </View>
                  <Switch
                    style={{ paddingTop: 14 }}
                    value={weightIsMetric}
                    onValueChange={(value) => setweightIsMetric(value)}
                  />
                </View>
              </View>
              <Button
                buttonStyle={[
                  styles.nextButton,
                  { opacity: isButtonDisabled ? 0.5 : 1 },
                ]}
                title="Continue"
                onPress={handleNext}
                disabled={isButtonDisabled}
              />
            </View>
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
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 40,
    color: "white",
    fontFamily: "Lato_700Bold",
  },
  nextButton: {
    fontFamily: "Lato_400Regular",
    borderRadius: 20,
    width: 240,
    height: 42,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  inputContainer: {
    width: 254,
    height: 55,
  },
  smallInputContainer: {
    width: 254 / 1.77,
    height: 55,
  },
  tinyInputContainer: {
    width: 254 / 4,
    height: 55,
  },
  inputWithUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },
  inputWithUnit: {
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  unitText: {
    paddingTop: 22,
    paddingLeft: 5,
    paddingRight: 5,
    color: "white",
    fontSize: 14,
    fontFamily: "Lato_400Regular",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_400Regular",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    alignSelf: "center",
    fontFamily: "Lato_400Regular",
  },
  inputRoundedContainer: {
    marginTop: 2,
    paddingLeft: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "#1f1f1f",
  },
});

export default PreSignUpScreen;
