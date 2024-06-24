import { Input, Button } from "@rneui/base";
import { View, Text, StyleSheet } from "react-native";
import { Exercise } from "./types";

const ExerciseSetCard = (
  sets: any[],
  exerciseIndex: number,
  dayIndex: number,
  exercise: Exercise,
  theme,
  isMetric,
  updateSets,
  handleDeleteSet
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
                  updateSets(dayIndex, exerciseIndex, setIndex, "reps", newReps)
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
              onPress={() => handleDeleteSet(dayIndex, exerciseIndex, setIndex)}
            />
          </View>
        )
      )}
    </View>
  );
};

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
