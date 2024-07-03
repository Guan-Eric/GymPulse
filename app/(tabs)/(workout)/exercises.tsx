import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BodyPartCard from "../../../components/BodyPartCard";
import { useTheme } from "@rneui/themed";

function ExerciseListScreen() {
  const [bodyPart] = useState([
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
  const { theme } = useTheme();
  const { route, planId, dayId } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Exercise</Text>
        <View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
          >
            <View style={styles.planContainer}>
              {bodyPart.map((item) => (
                <Pressable
                  style={styles.cardWrapper}
                  key={item.key}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(workout)/bodypart",
                      params: {
                        bodypart: item.name,
                        route: route,
                        planId: planId,
                        dayId: dayId,
                      },
                    })
                  }
                >
                  <BodyPartCard bodypart={item.name} theme={theme} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  planContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
});
export default ExerciseListScreen;
