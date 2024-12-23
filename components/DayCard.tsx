import React, { useState } from "react";
import {
  Input,
  Button,
  Icon,
  Card,
  BottomSheet,
  ListItem,
} from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import ExerciseSetCard from "./ExerciseSetCard";
import { deleteDay, updateDay } from "../backend/plan";
import BottomSheetMenu from "./modal/BottomSheetMenu";

function DayCard({
  plan,
  day,
  dayIndex,
  theme,
  isWeightMetric,
  setPlan,
  isWorkout,
  isDisabled,
  workoutTime,
}) {
  const handleDeleteDay = async (dayId: string) => {
    setPlan(await deleteDay(plan, dayId));
  };

  const updateDayName = (dayIndex: number, newName: string) => {
    setPlan(updateDay(plan, dayIndex, newName));
  };

  const bottomSheetOptions = [
    {
      title: "Start Workout",
      onPress: () => {
        router.push({
          pathname: "/(tabs)/(workout)/workout",
          params: {
            planId: plan.id,
            dayId: day.id,
            dayIndex: dayIndex,
            workoutTime: 0,
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.primary },
    },
    {
      title: "Add Exercise",
      onPress: () => {
        router.push({
          pathname: "/(tabs)/(workout)/exercises",
          params: {
            planId: plan.id,
            dayId: day.id,
            route: "add",
            dayIndex: dayIndex,
            workoutTime: workoutTime,
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.grey0 },
    },
    {
      title: "Delete Day",
      onPress: () => {
        handleDeleteDay(day.id);
      },
      containerStyle: { backgroundColor: theme.colors.error },
      titleStyle: { color: theme.colors.black },
    },
    {
      title: "Cancel",
      onPress: () => {
        null;
      },
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
  ];
  const workoutBottomSheetOptions = [
    {
      title: "Add Exercise",
      onPress: () => {
        router.push({
          pathname: "/(tabs)/(workout)/exercises",
          params: {
            planId: plan.id,
            dayId: day.id,
            route: "add",
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.primary },
    },
    {
      title: "Cancel",
      onPress: () => {
        null;
      },
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
  ];

  return (
    <Card
      containerStyle={{
        padding: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.grey0,
        borderColor: theme.colors.grey0,
        paddingBottom: 20,
      }}
    >
      <View style={styles.dayHeader}>
        <Input
          label={"Day Name"}
          disabled={isDisabled}
          containerStyle={styles.nameInput}
          inputContainerStyle={[
            styles.inputRoundedContainer,
            { borderColor: theme.colors.greyOutline },
          ]}
          onChangeText={(newDayName) => updateDayName(dayIndex, newDayName)}
          value={day?.name}
        />
        {!isWorkout && !isDisabled ? (
          <BottomSheetMenu
            options={isWorkout ? workoutBottomSheetOptions : bottomSheetOptions}
            theme={theme}
          />
        ) : null}
      </View>
      {day?.exercises &&
        day?.exercises?.map((exercise, exerciseIndex) => (
          <ExerciseSetCard
            key={exercise.id}
            plan={plan}
            sets={exercise.sets}
            exerciseIndex={exerciseIndex}
            day={day}
            dayIndex={dayIndex}
            exercise={exercise}
            theme={theme}
            isWeightMetric={isWeightMetric}
            setPlan={setPlan}
            isDisabled={isDisabled}
          />
        ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -15,
    marginTop: 5,
  },
  nameInput: {
    width: 200,
  },
  inputRoundedContainer: {
    marginTop: 6,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default DayCard;
