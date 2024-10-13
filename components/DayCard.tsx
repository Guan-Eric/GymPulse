import { Input, Button, Icon } from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import ExerciseSetCard from "./ExerciseSetCard";
import { deleteDay, updateDay } from "../backend/plan";

function DayCard({
  plan,
  day,
  dayIndex,
  theme,
  isMetric,
  setPlan,
  isWorkout,
  isDisabled,
}) {
  const handleDeleteDay = async (dayId: string) => {
    setPlan(await deleteDay(plan, dayId));
  };

  const updateDayName = (dayIndex: number, newName: string) => {
    setPlan(updateDay(plan, dayIndex, newName));
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={styles.dayHeader}>
        <Input
          disabled={isDisabled}
          containerStyle={styles.nameInput}
          inputContainerStyle={styles.nameInput}
          style={styles.nameInput}
          onChangeText={(newDayName) => updateDayName(dayIndex, newDayName)}
          value={day?.name}
        />
        {!isWorkout && !isDisabled && (
          <Button
            type="clear"
            icon={
              <Icon
                name="play-circle"
                size={24}
                color={theme.colors.black}
                type="material-community"
              />
            }
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(workout)/workout",
                params: {
                  planId: plan.id,
                  dayId: day.id,
                  dayIndex: dayIndex,
                },
              })
            }
          />
        )}
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
            isMetric={isMetric}
            setPlan={setPlan}
            isDisabled={isDisabled}
          />
        ))}
      {!isDisabled && (
        <>
          <Button
            type="clear"
            icon={
              <Icon
                name="plus-circle"
                size={24}
                color={theme.colors.black}
                type="material-community"
              />
            }
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(workout)/exercises",
                params: {
                  planId: plan.id,
                  dayId: day.id,
                  route: "add",
                },
              })
            }
          />
          {!isWorkout && (
            <Button
              type="clear"
              icon={
                <Icon
                  name="trash-can"
                  size={24}
                  color={theme.colors.black}
                  type="material-community"
                />
              }
              onPress={() => handleDeleteDay(day.id)}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  nameInput: {
    width: 200,
  },
});

export default DayCard;
