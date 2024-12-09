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
import BottomSheetMenu from "./BottomSheetView";

function DayCard({
  plan,
  day,
  dayIndex,
  theme,
  isWeightMetric,
  setPlan,
  isWorkout,
  isDisabled,
}) {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

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
        setBottomSheetVisible(false);
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
        setBottomSheetVisible(false);
        router.push({
          pathname: "/(tabs)/(workout)/exercises",
          params: {
            planId: plan.id,
            dayId: day.id,
            route: "add",
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.grey0 },
    },
    {
      title: "Delete Day",
      onPress: () => {
        setBottomSheetVisible(false);
        handleDeleteDay(day.id);
      },
      containerStyle: { backgroundColor: theme.colors.error },
      titleStyle: { color: theme.colors.black },
    },
    {
      title: "Cancel",
      onPress: () => setBottomSheetVisible(false),
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
          <BottomSheetMenu options={bottomSheetOptions} theme={theme} />
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
    borderColor: "gray",
  },
});

export default DayCard;
