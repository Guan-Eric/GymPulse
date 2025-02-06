import React, { Ref, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, CheckBox, Input, Slider, useTheme } from "@rneui/themed";
import { generatePlan } from "../../../backend/ai";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../../components/BackButton";
import { router } from "expo-router";

export default function GeneratePlanScreen() {
  const [goal, setGoal] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [level, setLevel] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const generatedPlan = await generatePlan(
        level,
        goal,
        category,
        equipment,
        count,
        preference
      );
      if (generatedPlan && generatedPlan.id) {
        router.push({
          pathname: "/(tabs)/(ai)/generatedPlanScreen",
          params: { generatePlanId: generatedPlan.id },
        });
      } else {
        throw new Error("Invalid generated plan");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BackButton />
              <Text style={[styles.title, { color: theme.colors.black }]}>
                Generate Your Workout Plan
              </Text>
            </View>
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 0,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Enter your goal"
              placeholder="e.g weight loss, muscle gain"
              value={goal}
              onChangeText={setGoal}
            />
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 10,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="How many exercises? (1-15)"
              placeholder="e.g 6"
              value={count.toString()}
              onChangeText={(text) => setCount(Number(text))}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              Workout Categories
            </Text>
            <View style={styles.checkboxRow}>
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                containerStyle={styles.checkboxContainer}
                checked={category.includes("strength")}
                title={"Strength"}
                onIconPress={() => {
                  if (category.includes("strength")) {
                    setCategory(category.filter((c) => c !== "strength"));
                  } else {
                    setCategory([...category, "strength"]);
                  }
                }}
              />
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                checked={category.includes("cardio")}
                title={"Cardio"}
                onIconPress={() => {
                  if (category.includes("cardio")) {
                    setCategory(category.filter((c) => c !== "cardio"));
                  } else {
                    setCategory([...category, "cardio"]);
                  }
                }}
              />
            </View>
            <View style={styles.checkboxRow}>
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                containerStyle={styles.checkboxContainer}
                checked={category.includes("plyometrics")}
                title={"Plyometrics"}
                onIconPress={() => {
                  if (category.includes("plyometrics")) {
                    setCategory(category.filter((c) => c !== "plyometrics"));
                  } else {
                    setCategory([...category, "plyometrics"]);
                  }
                }}
              />
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                checked={category.includes("powerlifting")}
                title={"Powerlifting"}
                onIconPress={() => {
                  if (category.includes("powerlifting")) {
                    setCategory(category.filter((c) => c !== "powerlifting"));
                  } else {
                    setCategory([...category, "powerlifting"]);
                  }
                }}
              />
            </View>

            <CheckBox
              textStyle={{ color: theme.colors.black }}
              checked={category.includes("stretching")}
              title={"Stretching"}
              onIconPress={() => {
                if (category.includes("stretching")) {
                  setCategory(category.filter((c) => c !== "stretching"));
                } else {
                  setCategory([...category, "stretching"]);
                }
              }}
            />
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 0,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Fitness Level"
              placeholder="e.g. beginner, intermediate, advanced"
              value={level}
              onChangeText={setLevel}
            />

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              Available Equipment
            </Text>

            <View style={styles.checkboxRow}>
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                containerStyle={styles.checkboxContainer}
                checked={equipment == "Only Weights"}
                title={"Only Weights"}
                onIconPress={() => setEquipment("Only Weights")}
              />
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                checked={equipment == "Weights and Machines"}
                title={"Weights and Machines"}
                onIconPress={() => setEquipment("Weights and Machines")}
              />
            </View>
            <View style={styles.checkboxRow}>
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                containerStyle={styles.checkboxContainer}
                checked={equipment == "Full Gym"}
                title={"Full Gym"}
                onIconPress={() => setEquipment("Full Gym")}
              />
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                checked={equipment == "None"}
                title={"None"}
                onIconPress={() => setEquipment("None")}
              />
            </View>
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 0,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Other Preferences"
              placeholder="e.g. focus on arms, chest, back, etc..."
              value={preference}
              onChangeText={setPreference}
            />
            <Button
              titleStyle={styles.buttonTitle}
              disabled={
                goal &&
                category &&
                level &&
                equipment &&
                count <= 15 &&
                count > 0 &&
                !loading
                  ? false
                  : true
              }
              buttonStyle={{
                backgroundColor: theme.colors.primary,
                width: 200,
                borderRadius: 20,
                alignSelf: "center",
              }}
              title="Generate Plan"
              onPress={handleGeneratePlan}
              loading={loading}
              containerStyle={styles.buttonContainer}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Lato_700Bold",
    paddingLeft: 20,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  planContainer: {
    marginTop: 30,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    height: 42,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    color: "white",
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
  inputRoundedContainer: {
    marginTop: 2,
    paddingLeft: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  checkboxContainer: {
    width: "35%",
  },
  buttonContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  buttonTitle: {
    fontFamily: "Lato_700Bold",
  },
});
