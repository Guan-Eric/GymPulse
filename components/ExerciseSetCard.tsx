import { Input, Button, Card, Icon } from "@rneui/themed";
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
  isWeightMetric,
  setPlan,
  isDisabled,
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
        {
          backgroundColor: theme.colors.grey1,
          borderColor: theme.colors.grey1,
        },
      ]}
    >
      <View style={styles.exerciseHeader}>
        <Text style={[styles.baseText, { color: theme.colors.black }]}>
          {exercise.name}
        </Text>
        {!isDisabled && (
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
            onPress={() => handleDeleteExercise(day.id, exercise.id)}
          />
        )}
      </View>
      <View>
        <View style={styles.setHeader}>
          {!exercise.cardio ? (
            <>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Reps
              </Text>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Weight
              </Text>
            </>
          ) : (
            <Text style={[styles.baseText, { color: theme.colors.black }]}>
              Duration
            </Text>
          )}
        </View>
        {sets?.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text style={[styles.baseText, { color: theme.colors.black }]}>
              {`Set ${setIndex + 1}`}
            </Text>
            <>
              <Input
                disabled={isDisabled}
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputRoundedContainer}
                inputStyle={styles.input}
                onChangeText={(value) =>
                  updateSets(
                    dayIndex,
                    exerciseIndex,
                    setIndex,
                    "reps",
                    parseInt(value) ? parseInt(value) : 0
                  )
                }
                value={set.reps.toString()}
              />
              {!exercise.cardio ? (
                <>
                  <Text style={{ color: theme.colors.black }}>x</Text>
                  <Input
                    disabled={isDisabled}
                    keyboardType="numeric"
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.inputRoundedContainer}
                    inputStyle={styles.input}
                    onChangeText={(value) =>
                      updateSets(
                        dayIndex,
                        exerciseIndex,
                        setIndex,
                        "weight_duration",
                        isWeightMetric
                          ? parseFloat(value) * 2.205
                            ? parseFloat(value) * 2.205
                            : 0
                          : parseFloat(value)
                          ? parseFloat(value)
                          : 0
                      )
                    }
                    value={
                      isWeightMetric
                        ? Math.floor(set.weight_duration / 2.205).toString()
                        : Math.floor(set.weight_duration).toString()
                    }
                  />
                  <Text style={{ color: theme.colors.black }}>
                    {isWeightMetric ? "kg" : "lbs"}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ color: theme.colors.black }}>m</Text>
                  <Input
                    disabled={isDisabled}
                    keyboardType="numeric"
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.inputRoundedContainer}
                    inputStyle={styles.input}
                    onChangeText={(value) =>
                      updateSets(
                        dayIndex,
                        exerciseIndex,
                        setIndex,
                        "weight_duration",
                        parseFloat(value) ? parseFloat(value) : 0
                      )
                    }
                    value={set?.weight_duration.toString()}
                  />
                  <Text style={{ color: theme.colors.black }}>s</Text>
                </>
              )}
            </>
            {!isDisabled && (
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
                onPress={() =>
                  handleDeleteSet(dayIndex, exerciseIndex, setIndex)
                }
              />
            )}
          </View>
        ))}
      </View>
      {!isDisabled && (
        <Button
          size="sm"
          type="clear"
          icon={
            <Icon
              name="plus-circle"
              size={24}
              color={theme.colors.black}
              type="material-community"
            />
          }
          onPress={() => handleAddSet(day.id, exercise.id, plan?.days)}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 10,
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
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  baseText: {
    fontSize: 18,
  },
  inputContainer: {
    width: 70,
    height: 40,
  },
  inputRoundedContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    overflow: "hidden",
  },
  input: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default ExerciseSetCard;
