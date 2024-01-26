import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Appearance,
  ScrollView,
  Image,
} from "react-native";
import { theme } from "../styles/Theme";
import { SafeAreaView } from "react-native-safe-area-context";

function ExerciseListScreen({ navigation }) {
  const [styles, setSetyles] = useState(
    Appearance.getColorScheme() == "light" ? theme.lightMode : theme.darkMode
  );
  const [bodyPart, setBodyPart] = useState([
    { name: "Chest", key: "1" },
    { name: "Middle Back", key: "2" },
    { name: "Lower Back", key: "3" },
    { name: "Triceps", key: "4" },
    { name: "Biceps", key: "5" },
    { name: "Shoulders", key: "6" },
    { name: "Quadriceps", key: "7" },
    { name: "Hamstrings", key: "8" },
    { name: "Glutes", key: "9" },
    { name: "Neck", key: "10" },
    { name: "Abdominals", key: "11" },
    { name: "Lats", key: "12" },
    { name: "Calves", key: "13" },
    { name: "Forearms", key: "14" },
    { name: "Adductors", key: "15" },
    { name: "Abductors", key: "16" },
    { name: "Traps", key: "17" },
  ]);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Exercise</Text>
        <View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
          >
            {bodyPart.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => navigation.navigate("BodyPart", { item })}
              >
                <Text style={styles.baseText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default ExerciseListScreen;
