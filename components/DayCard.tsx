import { Input, Button, Card } from "@rneui/themed";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
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
    <Card
      containerStyle={[
        styles.card,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.dayHeader}>
        <Input
          disabled={isDisabled}
          containerStyle={styles.nameInput}
          inputContainerStyle={styles.nameInput}
          style={styles.nameInput}
          onChangeText={(newDayName) => updateDayName(dayIndex, newDayName)}
          value={day?.name}
        />
        {isWorkout || isDisabled ? null : (
          <Button
            title="Start Workout"
            type="clear"
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
      {isDisabled ? null : (
        <>
          <Button
            type="clear"
            title="Add Exercise"
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
          <Button
            type="clear"
            title="Delete Day"
            onPress={() => handleDeleteDay(day.id)}
          />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
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
