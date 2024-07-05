import React, { useEffect, useState, useCallback } from "react";
import { Text, View, Pressable, FlatList, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@rneui/themed";
import { createPlan, getPlans } from "../../../backend/plan";
import PlanCard from "../../../components/PlanCard";
import EmptyPlanCard from "../../../components/EmptyPlanCard";
import BodyPartCard from "../../../components/BodyPartCard";
import { Plan } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";

const bodyParts = [
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
];

function PlanScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { theme } = useTheme();

  const fetchPlans = async () => {
    setPlans(await getPlans());
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );

  const handleCreatePlan = async () => {
    const newPlan = await createPlan();
    setPlans((prevPlans) => [...prevPlans, newPlan]);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={[styles.container, { paddingBottom: -50 }]}>
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              alignContent: "space-between",
            }}
          >
            <Text style={[styles.titleText, { color: theme.colors.black }]}>
              Your Plans
            </Text>
          </View>
          <View style={styles.planContainer}>
            {plans.length == 0
              ? null
              : plans.map((item) => (
                  <View key={item.id} style={styles.cardWrapper}>
                    <PlanCard plan={item} theme={theme} />
                  </View>
                ))}
            <View key="empty-plan-card" style={styles.cardWrapper}>
              <EmptyPlanCard onPress={handleCreatePlan} />
            </View>
          </View>
          <Text style={[styles.titleText, { color: theme.colors.black }]}>
            View Exercises
          </Text>
          <View style={styles.planContainer}>
            {bodyParts.map((item) => (
              <Pressable
                style={styles.cardWrapper}
                key={item.key}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/bodypart",
                    params: { bodypart: item.name, route: "exercise" },
                  })
                }
              >
                <BodyPartCard bodypart={item.name} theme={theme} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
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
    paddingLeft: 10,
    fontFamily: "Lato_400Regular",
    fontSize: 20,
  },
  titleText: {
    fontFamily: "Lato_700Bold",
    fontSize: 24,
    paddingLeft: 10,
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
export default PlanScreen;
