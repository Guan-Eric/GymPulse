import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Day, Exercise, Plan } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button } from "@rneui/themed";
import {
  addDay,
  addSet,
  deleteDay,
  deleteExercise,
  deleteSet,
  getPlan,
  savePlan,
  updateDay,
  updateSet,
} from "../../../backend/plan";
import ExerciseSetCard from "../../../components/ExerciseSetCard";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isDirty, setIsDirty] = useState(false);
  const [isMetric, setIsMetric] = useState();
  const { planId } = useLocalSearchParams();
  const { theme } = useTheme();
  const fetchPlanFromFirestore = async () => {
    setPlan(await getPlan(planId as string));
  };
  useEffect(() => {
    if (isDirty) {
      handleSavePlan();
      setIsDirty(false);
    }
  }, [plan, isDirty]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanFromFirestore();
    }, [])
  );

  useEffect(() => {
    fetchPlanFromFirestore();
  }, []);

  const handleSavePlan = async () => {
    savePlan(plan);
  };

  const handleAddDay = async () => {
    setPlan(await addDay(plan));
  };

  const handleAddSet = async (
    dayId: string,
    exerciseId: string,
    days: Day[]
  ) => {
    setPlan(await addSet(plan, dayId, exerciseId, days));
  };

  const handleDeleteDay = async (dayId: string) => {
    setPlan(await deleteDay(plan, dayId));
  };

  const handleDeleteExercise = async (dayId: string, exerciseId: string) => {
    setPlan(await deleteExercise(plan, dayId, exerciseId));
  };

  const handleDeleteSet = (
    dayIndex: any,
    exerciseIndex: any,
    setIndex: number
  ) => {
    setPlan(deleteSet(plan, dayIndex, exerciseIndex, setIndex));
  };

  const updateSets = (
    dayIndex: any,
    exerciseIndex: any,
    setIndex: number,
    property: string,
    value: string | number
  ) => {
    setPlan(
      updateSet(plan, dayIndex, exerciseIndex, setIndex, property, value)
    );
  };

  const updateDayName = (dayIndex: number, newName: string) => {
    setPlan(updateDay(plan, dayIndex, newName));
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Input
          style={styles.nameInput}
          onChangeText={() => handleSavePlan()}
          value={plan?.name}
        />
        <ScrollView>
          {plan?.days?.map((day, dayIndex) => (
            <View key={day.id}>
              <View style={{ flexDirection: "row" }}>
                <Input
                  containerStyle={styles.nameInput}
                  inputContainerStyle={styles.nameInput}
                  style={styles.nameInput}
                  onChangeText={(newDayName) =>
                    updateDayName(dayIndex, newDayName)
                  }
                  value={day.name}
                />
                <Button
                  title="Start Workout"
                  type="clear"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(workout)/workout",
                      params: {
                        planId: planId,
                        dayId: day.id,
                      },
                    })
                  }
                />
              </View>
              {day.exercises &&
                day.exercises?.map((exercise, exerciseIndex) => (
                  <View key={exercise.id}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={[styles.baseText, { color: theme.colors.black }]}
                      >
                        {exercise.name}
                      </Text>
                      <Button
                        type="clear"
                        title="Delete Exercise"
                        onPress={() =>
                          handleDeleteExercise(day.id, exercise.id)
                        }
                      />
                    </View>
                    {ExerciseSetCard(
                      exercise.sets,
                      exerciseIndex,
                      dayIndex,
                      exercise,
                      theme,
                      isMetric,
                      updateSets,
                      handleDeleteSet
                    )}
                    <Button
                      size="sm"
                      type="clear"
                      title="Add Set"
                      onPress={() =>
                        handleAddSet(day.id, exercise.id, plan?.days)
                      }
                    />
                  </View>
                ))}
              <Button
                type="clear"
                title="Add Exercise"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/exercises",
                    params: {
                      planId: planId,
                      dayId: day.id,
                      route: "add",
                    },
                  })
                }
              />
              <Button
                type="clear"
                title="Delete Day"
                onPress={() => handleDeleteDay(day.id)}
              />
            </View>
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
