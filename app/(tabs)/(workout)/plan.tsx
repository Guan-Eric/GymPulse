import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plan } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button, Card, Icon } from "@rneui/themed";
import { addDay, deletePlan, getPlan, savePlan } from "../../../backend/plan";
import DayCard from "../../../components/DayCard";
import { getMetric } from "../../../backend/user";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { Instagram } from "react-content-loader/native";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isMetric, setIsMetric] = useState(true);
  const { planId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchPlanFromFirestore = async () => {
    try {
      setPlan(await getPlan(planId as string));
      setIsMetric(await getMetric(FIREBASE_AUTH.currentUser.uid));
    } catch (error) {
      console.error("Error fetching plan:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <View>
        <Instagram />
      </View>
    );
  }

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

        <ScrollView>
          {plan?.days.length > 0
            ? plan?.days?.map((day, dayIndex) => (
                <DayCard
                  key={day.id}
                  plan={plan}
                  day={day}
                  dayIndex={dayIndex}
                  theme={theme}
                  isMetric={isMetric}
                  setPlan={setPlan}
                  isWorkout={false}
                  isDisabled={false}
                />
              ))
            : null}
          <Button
            type="clear"
            icon={
              <Icon
                name="plus-circle-outline"
                size={24}
                color={theme.colors.black}
                type="material-community"
              />
            }
            onPress={handleAddDay}
          />
          <Button
            type="clear"
            title="Delete Plan"
            onPress={handleDeletePlan}
            color={theme.colors.error}
          />
        </ScrollView>
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
