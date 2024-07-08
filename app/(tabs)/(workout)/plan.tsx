import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plan } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button, Card } from "@rneui/themed";
import { addDay, deletePlan, getPlan, savePlan } from "../../../backend/plan";
import DayCard from "../../../components/DayCard";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isMetric, setIsMetric] = useState(true); // Set default as metric for now
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
    setPlan({ ...plan, name });
  };

  const handleAddDay = async () => {
    setPlan(await addDay(plan));
  };

  const handleDeletePlan = async () => {
    deletePlan(plan);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      behavior="padding"
    >
      <SafeAreaView style={{ paddingBottom: 35 }}>
        <Input
          containerStyle={styles.nameInput}
          inputContainerStyle={styles.nameInput}
          style={styles.nameInput}
          onChangeText={handleSaveName}
          value={plan?.name}
        />
        {plan?.days.length > 0 ? (
          <ScrollView>
            {plan?.days?.map((day, dayIndex) => (
              <DayCard
                key={day.id}
                plan={plan}
                day={day}
                dayIndex={dayIndex}
                theme={theme}
                isMetric={isMetric}
                setPlan={setPlan}
                isWorkout={false}
              />
            ))}
            <Button type="clear" title="Add Day" onPress={handleAddDay} />
            <Button
              type="solid"
              title="Delete Plan"
              onPress={handleDeletePlan}
            />
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  nameInput: {
    width: "100%",
  },
});

export default ViewPlanScreen;
