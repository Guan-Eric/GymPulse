import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Exercise } from "../../../components/types";
import { Button, Card, CheckBox, Input, useTheme } from "@rneui/themed";
import { fetchSuggestions } from "../../../backend/ai";
import BackButton from "../../../components/BackButton";

export default function SuggestExerciseScreen() {
  const [suggestions, setSuggestions] = useState<Exercise[]>([]);
  const [bodyPart, setBodyPart] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const handleSuggestExercises = async () => {
    setLoading(true);
    setSuggestions(await fetchSuggestions(bodyPart, goal, preference));
    setLoading(false);
  };

  const renderExercise = ({ item }: { item: Exercise }) => (
    <Card
      containerStyle={[
        styles.exerciseCard,
        {
          backgroundColor: theme.colors.grey0,
          borderColor: theme.colors.grey0,
        },
      ]}
    >
      <Text style={[styles.exerciseName, { color: theme.colors.black }]}>
        {item.name}
      </Text>
    </Card>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Exercise Suggestions
          </Text>
        </View>
        <ScrollView>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "chest"}
              title={"Chest"}
              onIconPress={() => setBodyPart("chest")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "middle back"}
              title={"Middle Back"}
              onIconPress={() => setBodyPart("middle back")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "lower back"}
              title={"Lower Back"}
              onIconPress={() => setBodyPart("lower back")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "triceps"}
              title={"Triceps"}
              onIconPress={() => setBodyPart("triceps")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "biceps"}
              title={"Biceps"}
              onIconPress={() => setBodyPart("biceps")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "shoulders"}
              title={"Shoulders"}
              onIconPress={() => setBodyPart("shoulders")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "quadriceps"}
              title={"Quadriceps"}
              onIconPress={() => setBodyPart("quadriceps")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "hamstrings"}
              title={"Hamstrings"}
              onIconPress={() => setBodyPart("hamstrings")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "glutes"}
              title={"Glutes"}
              onIconPress={() => setBodyPart("glutes")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "neck"}
              title={"Neck"}
              onIconPress={() => setBodyPart("neck")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "abdominals"}
              title={"Abdominals"}
              onIconPress={() => setBodyPart("abdominals")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "lats"}
              title={"Lats"}
              onIconPress={() => setBodyPart("lats")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "calves"}
              title={"Calves"}
              onIconPress={() => setBodyPart("calves")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "forearms"}
              title={"Forearms"}
              onIconPress={() => setBodyPart("forearms")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "adductors"}
              title={"Adductors"}
              onIconPress={() => setBodyPart("adductors")}
            />
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "abductors"}
              title={"Abductors"}
              onIconPress={() => setBodyPart("abductors")}
            />
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              textStyle={{ color: theme.colors.black }}
              containerStyle={styles.checkboxContainer}
              checked={bodyPart === "traps"}
              title={"Traps"}
              onIconPress={() => setBodyPart("traps")}
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
            inputContainerStyle={[
              styles.inputRoundedContainer,
              { backgroundColor: theme.colors.grey0 },
            ]}
            containerStyle={styles.inputContainer}
            style={styles.input}
            label="What is your goal?"
            placeholder="e.g. build muscle, lose weight, athleticism"
            value={goal}
            onChangeText={setGoal}
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
            inputContainerStyle={[
              styles.inputRoundedContainer,
              { backgroundColor: theme.colors.grey0 },
            ]}
            containerStyle={[styles.inputContainer, { marginVertical: 20 }]}
            style={styles.input}
            label="Enter your exercise preference"
            placeholder="e.g. replace bench press"
            value={preference}
            onChangeText={setPreference}
          />

          <Button
            disabled={bodyPart && goal ? false : true}
            title="Get Suggestions"
            onPress={handleSuggestExercises}
            buttonStyle={{
              backgroundColor: theme.colors.primary,
              width: 200,
              borderRadius: 20,
              alignSelf: "center",
            }}
            loading={loading}
            containerStyle={styles.buttonContainer}
          />

          <FlatList
            data={suggestions}
            renderItem={renderExercise}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },

  input: {
    fontFamily: "Lato_400Regular",
  },
  label: {
    fontFamily: "Lato_700Bold",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },

  exerciseCard: {
    borderRadius: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  checkboxContainer: {
    width: "35%",
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Lato_700Bold",
    paddingLeft: 20,
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
});
