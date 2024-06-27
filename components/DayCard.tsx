import { Input, Button } from "@rneui/themed";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import ExerciseSetCard from "./ExerciseSetCard";
import { deleteDay, updateDay } from "../backend/plan";

function DayCard({ plan, day, dayIndex, theme, isMetric, setPlan }) {
  const handleDeleteDay = async (dayId: string) => {
    setPlan(await deleteDay(plan, dayId));
  };
  const updateDayName = (dayIndex: number, newName: string) => {
    setPlan(updateDay(plan, dayIndex, newName));
  };

  return (
    <View key={day.id}>
      <View style={{ flexDirection: "row" }}>
        <Input
          containerStyle={styles.nameInput}
          inputContainerStyle={styles.nameInput}
          style={styles.nameInput}
          onChangeText={(newDayName) => updateDayName(dayIndex, newDayName)}
          value={day.name}
        />
        <Button
          title="Start Workout"
          type="clear"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(workout)/workout",
              params: {
                planId: plan.id,
                dayId: day.id,
              },
            })
          }
        />
      </View>
      {day.exercises &&
        day.exercises?.map((exercise, exerciseIndex) => (
          <ExerciseSetCard
            plan={plan}
            sets={exercise.sets}
            exerciseIndex={exerciseIndex}
            day={day}
            dayIndex={dayIndex}
            exercise={exercise}
            theme={theme}
            isMetric={isMetric}
            setPlan={setPlan}
          />
        ))}
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

export default DayCard;
