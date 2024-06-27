import { Input, Button } from "@rneui/base";
import { View, Text, StyleSheet } from "react-native";
import { Day, Exercise, Plan } from "./types";
import { addSet, deleteExercise, deleteSet, updateSet } from "../backend/plan";

function ExerciseSetCard({
  plan,
  sets,
  exerciseIndex,
  day,
  dayIndex,
  exercise,
  theme,
  isMetric,
  setPlan,
}) {
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
  const handleAddSet = async (
    dayId: string,
    exerciseId: string,
    days: Day[]
  ) => {
    setPlan(await addSet(plan, dayId, exerciseId, days));
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

  return (
    <View key={exercise.id}>
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.baseText, { color: theme.colors.black }]}>
          {exercise.name}
        </Text>
        <Button
          type="clear"
          title="Delete Exercise"
          onPress={() => handleDeleteExercise(day.id, exercise.id)}
        />
      </View>
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
      <Button
        size="sm"
        type="clear"
        title="Add Set"
        onPress={() => handleAddSet(day.id, exercise.id, plan?.days)}
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

export default ExerciseSetCard;
