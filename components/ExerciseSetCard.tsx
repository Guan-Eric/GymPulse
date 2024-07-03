import { Input, Button, Card } from "@rneui/themed";
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
    dayIndex: number,
    exerciseIndex: number,
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
    dayIndex: number,
    exerciseIndex: number,
    setIndex: number
  ) => {
    setPlan(deleteSet(plan, dayIndex, exerciseIndex, setIndex));
  };

  return (
    <Card
      containerStyle={[
        styles.card,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.exerciseHeader}>
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
        <View style={styles.setHeader}>
          {!exercise.cardio && (
            <>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Reps
              </Text>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Weight
              </Text>
            </>
          )}
          {exercise.cardio && <Text style={styles.baseText}>Duration</Text>}
        </View>
        {sets?.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text style={[styles.baseText, { color: theme.colors.black }]}>
              {`Set ${setIndex + 1}`}
            </Text>
            {!exercise.cardio && (
              <Input
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(newReps) =>
                  updateSets(dayIndex, exerciseIndex, setIndex, "reps", newReps)
                }
                value={set.reps.toString()}
              />
            )}
            {!exercise.cardio && (
              <>
                <Text style={{ color: theme.colors.black }}>x</Text>
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
                <Text style={{ color: theme.colors.black }}>
                  {isMetric ? "kg" : "lbs"}
                </Text>
              </>
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
                value={set?.weight_duration.toString()}
              />
            )}
            <Button
              type="clear"
              title="Delete Set"
              onPress={() => handleDeleteSet(dayIndex, exerciseIndex, setIndex)}
            />
          </View>
        ))}
      </View>
      <Button
        size="sm"
        type="clear"
        title="Add Set"
        onPress={() => handleAddSet(day.id, exercise.id, plan?.days)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  setHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  baseText: {
    fontSize: 18,
  },
  input: {
    width: 60,
  },
});

export default ExerciseSetCard;
