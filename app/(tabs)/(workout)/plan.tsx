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

  const renderSetInputs = (
    sets: any[],
    exerciseIndex: number,
    dayIndex: number,
    exercise: Exercise
  ) => {
    return (
      <View>
        <View style={styles.setRow}>
          {!exercise.cardio && (
            <View style={styles.setRow}>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Reps
              </Text>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Weight
              </Text>
            </View>
          )}
          {exercise.cardio && <Text style={styles.baseText}>Duration</Text>}
        </View>
        {sets?.map(
          (
            set: { reps: { toString: () => string }; weight_duration: number },
            setIndex: number
          ) => (
            <View key={setIndex} style={styles.setRow}>
              <Text
                style={[styles.baseText, { color: theme.colors.black }]}
              >{`Set ${setIndex + 1}`}</Text>
              {!exercise.cardio && (
                <Input
                  keyboardType="numeric"
                  style={styles.input}
                  onChangeText={(newReps) =>
                    updateSets(
                      dayIndex,
                      exerciseIndex,
                      setIndex,
                      "reps",
                      newReps
                    )
                  }
                  value={set.reps.toString()}
                />
              )}
              {!exercise.cardio && (
                <Text style={{ color: theme.colors.black }}>x</Text>
              )}
              {!exercise.cardio && (
                <Input
                  keyboardType="numeric"
                  style={styles.input}
                  onChangeText={(newWeight) =>
                    updateSets(
                      dayIndex,
                      exerciseIndex,
                      setIndex,
                      "weight_duration",
                      isMetric
                        ? parseFloat(newWeight) * 2.205
                        : parseFloat(newWeight)
                    )
                  }
                  value={
                    isMetric
                      ? Math.floor(set.weight_duration / 2.205).toString()
                      : Math.floor(set.weight_duration).toString()
                  }
                />
              )}
              {!exercise.cardio && (
                <Text style={{ color: theme.colors.black }}>
                  {isMetric ? "kg" : "lbs"}
                </Text>
              )}
              {exercise.cardio && (
                <Input
                  keyboardType="numeric"
                  style={styles.input}
                  onChangeText={(newDuration) =>
                    updateSets(
                      dayIndex,
                      exerciseIndex,
                      setIndex,
                      "weight_duration",
                      newDuration
                    )
                  }
                  value={set.weight_duration.toString()}
                />
              )}
              <Button
                type="clear"
                title="Delete Set"
                onPress={() =>
                  handleDeleteSet(dayIndex, exerciseIndex, setIndex)
                }
              />
            </View>
          )
        )}
      </View>
    );
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
                    {renderSetInputs(
                      exercise.sets,
                      exerciseIndex,
                      dayIndex,
                      exercise
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
