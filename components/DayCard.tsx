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
import ThreeDotsModal from "./modal/ThreeDotsModal";
import { doc, collection, updateDoc } from "firebase/firestore";
import DraggableFlatList from "react-native-draggable-flatlist";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { Day, Exercise, Plan } from "./types";

interface DayCardProps {
  plan: Plan;
  day: Day;
  theme: any;
  isWeightMetric: boolean;
  setPlan: (plan: Plan) => void;
  isWorkout: boolean;
  isDisabled: boolean;
  workoutTime: number;
  onLongPress: () => void;
}
const DayCard: React.FC<DayCardProps> = ({
  plan,
  day,
  theme,
  isWeightMetric,
  setPlan,
  isWorkout,
  isDisabled,
  workoutTime,
}) => {
  const handleDeleteDay = async (dayId: string) => {
    setPlan(await deleteDay(plan, dayId));
  };

  const updateDayName = (newName: string) => {
    setPlan(updateDay(plan, day.id, newName));
  };

  const handleDragEnd = ({ data }) => {
    const updatedExercises = data.map((exercise, index) => ({
      ...exercise,
      index,
    }));
    const updatedDay = { ...day, exercises: updatedExercises };
    setPlan({
      ...plan,
      days: plan.days.map((d) => (d.id === day.id ? updatedDay : d)),
    });

    // Update Firestore with new indexes
    const dayDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Days/${day.id}`
    );
    const exercisesCollectionRef = collection(dayDocRef, "Exercise");

    updatedExercises.forEach(async (exercise) => {
      const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
      await updateDoc(exerciseDocRef, { index: exercise.index });
    });
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
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
    {
      title: "Delete Day",
      onPress: () => {
        handleDeleteDay(day.id);
      },
      containerStyle: { backgroundColor: theme.colors.error },
    },
    {
      title: "Cancel",
      onPress: () => {
        null;
      },
      containerStyle: { backgroundColor: theme.colors.grey2 },
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
            workoutTime: workoutTime,
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
      containerStyle: { backgroundColor: theme.colors.grey2 },
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
          onChangeText={(newDayName) => updateDayName(newDayName)}
          value={day?.name}
        />
        {!isDisabled ? (
          <ThreeDotsModal
            options={isWorkout ? workoutBottomSheetOptions : bottomSheetOptions}
            theme={theme}
          />
        ) : null}
      </View>
      {day?.exercises && (
        <DraggableFlatList
          data={day.exercises.sort((a, b) => a.index - b.index)}
          renderItem={({ item, drag }: { item: Exercise; drag }) => (
            <ExerciseSetCard
              key={item.id}
              plan={plan}
              sets={item.sets}
              day={day}
              exercise={item}
              theme={theme}
              isWeightMetric={isWeightMetric}
              setPlan={setPlan}
              isDisabled={isDisabled}
              onLongPress={!isDisabled ? drag : null}
            />
          )}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
        />
      )}
    </Card>
  );
};

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
