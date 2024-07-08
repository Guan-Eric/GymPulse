import React, { useState } from "react";
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

const sexOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

function PreSignUpScreen() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isMetric, setIsMetric] = useState(true);

  const handleNext = () => {
    router.push({
      pathname: "/signup",
      params: { username, name, age, sex, height, weight, isMetric },
    });
  };

  const isButtonDisabled =
    !username || !name || !age || !sex || !height || !weight;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.titleText}>Sign Up</Text>
          <View>
            <Input
              style={styles.input}
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
              autoCapitalize="none"
            />
            <Input
              style={styles.input}
              placeholder="Name"
              onChangeText={(text) => setName(text)}
            />
            <Input
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              onChangeText={(text) => setAge(text)}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Gender</Text>
              <Picker
                style={styles.picker}
                selectedValue={sex}
                onValueChange={(itemValue) => setSex(itemValue)}
              >
                <Picker.Item label="Select Sex" value="" />
                {sexOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            <Input
              style={styles.input}
              placeholder={isMetric ? "Height (cm)" : "Height (in)"}
              keyboardType="numeric"
              onChangeText={(text) => setHeight(text)}
            />
            <Input
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
  pickerContainer: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#333",
  },
  pickerLabel: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato_400Regular",
    marginBottom: 5,
  },
  picker: {
    color: "white",
    fontFamily: "Lato_400Regular",
  },
});

export default PreSignUpScreen;
