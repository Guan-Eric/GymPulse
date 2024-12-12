import { Input, Button, Card, Icon } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { Day, Exercise, Plan } from "./types";
import { addSet, deleteExercise, deleteSet, updateSet } from "../backend/plan";
import BottomSheetMenu from "./BottomSheetMenu";

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

  const exerciseBottomSheetOptions = [
    {
      title: "Add Set",
      onPress: () => {
        handleAddSet(day.id, exercise.id, plan?.days);
      },
      containerStyle: { backgroundColor: theme.colors.grey0 },
    },
    {
      title: "Delete Exercise",
      onPress: () => {
        handleDeleteExercise(day.id, exercise.id);
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
          <BottomSheetMenu options={exerciseBottomSheetOptions} theme={theme} />
        )}
      </View>
      <View>
        <View style={styles.setHeader}>
          {!exercise.cardio ? (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                paddingLeft: "24%",
                justifyContent: "space-between",
                paddingRight: "30%",
              }}
            >
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Reps
              </Text>
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                Weight
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.baseText,
                { color: theme.colors.black, paddingLeft: "34%" },
              ]}
            >
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
              <BottomSheetMenu
                options={[
                  {
                    title: "Delete Set",
                    onPress: () => {
                      handleDeleteSet(dayIndex, exerciseIndex, setIndex);
                    },
                    containerStyle: { backgroundColor: theme.colors.error },
                    titleStyle: { color: theme.colors.black },
                  },
                  {
                    title: "Cancel",
                    onPress: null,
                    containerStyle: { backgroundColor: theme.colors.grey1 },
                  },
                ]}
                theme={theme}
              />
            )}
          </View>
        ))}
      </View>
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
