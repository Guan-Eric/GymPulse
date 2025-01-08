import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View, Pressable, ScrollView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BodyPartCard from "../../../components/BodyPartCard";
import { useTheme } from "@rneui/themed";
import BackButton from "../../../components/BackButton";

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
  const { route, planId, workoutTime } = useLocalSearchParams();
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          marginBottom: Platform.OS == "ios" ? -35 : 0,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <BackButton />
        <Text style={[styles.titleText, { color: theme.colors.black }]}>
          Body Part
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
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
                    workoutTime: workoutTime,
                  },
                })
              }
            >
              <BodyPartCard bodypart={item.name} theme={theme} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  planContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
});

export default ExerciseListScreen;
