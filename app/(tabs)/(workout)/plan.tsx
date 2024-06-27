import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plan } from "../../../components/types";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button } from "@rneui/themed";
import { addDay, getPlan, savePlan } from "../../../backend/plan";
import DayCard from "../../../components/DayCard";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isMetric, setIsMetric] = useState();
  const { planId } = useLocalSearchParams();
  const { theme } = useTheme();
  const fetchPlanFromFirestore = async () => {
    setPlan(await getPlan(planId as string));
  };

  useEffect(() => {
    if (plan) {
      savePlan(plan);
    }
  }, [plan]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanFromFirestore();
    }, [])
  );

  useEffect(() => {
    fetchPlanFromFirestore();
  }, []);

  const handleSaveName = (name: string) => {
    setPlan({ ...plan, name: name });
  };

  const handleAddDay = async () => {
    setPlan(await addDay(plan));
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <Input
            style={styles.nameInput}
            onChangeText={(newName) => handleSaveName(newName)}
            value={plan?.name}
          />
          {plan?.days?.map((day, dayIndex) => (
            <DayCard
              plan={plan}
              day={day}
              dayIndex={dayIndex}
              theme={theme}
              isMetric={isMetric}
              setPlan={setPlan}
            />
          ))}
          <Button type="clear" title="Add Day" onPress={handleAddDay} />
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
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 50,
  },
  input: { width: 50 },
  nameInput: { width: 50 },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
export default ViewPlanScreen;
