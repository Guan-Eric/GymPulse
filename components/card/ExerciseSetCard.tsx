import { Input, Button, Card, Icon, ButtonGroup } from "@rneui/themed";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Exercise, Plan } from "../types";
import {
  addSet,
  deleteExercise,
  deleteSet,
  updateSet,
} from "../../backend/plan";
import ThreeDotsModal from "../modal/ThreeDotsModal";
import EmptySetCard from "./EmptySetCard";
import { router } from "expo-router";

interface ExerciseSetCardProps {
  plan: Plan;
  sets: any[];
  exercise: Exercise;
  theme: any;
  isWeightMetric: boolean;
  isDisabled: boolean;
  workoutTime: number;
  setPlan: (plan: Plan) => void;
}
const ExerciseSetCard: React.FC<ExerciseSetCardProps> = ({
  plan,
  sets,
  exercise,
  theme,
  isWeightMetric,
  isDisabled,
  workoutTime,
  setPlan,
}) => {
  const updateSets = (
    setIndex: number,
    property: string,
    value: string | number
  ) => {
    setPlan(updateSet(plan, exercise.id, setIndex, property, value));
  };

  const handleAddSet = async (exerciseId: string, value: number) => {
    setPlan(await addSet(plan, exerciseId, value));
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    setPlan(await deleteExercise(plan, exerciseId));
  };

  const handleDeleteSet = (setIndex: number) => {
    setPlan(deleteSet(plan, exercise.id, setIndex));
  };

  const exerciseBottomSheetOptions = [
    {
      title: "Delete Exercise",
      onPress: () => {
        handleDeleteExercise(exercise.id);
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

  return (
    <Card
      containerStyle={[
        styles.card,
        {
          backgroundColor: theme.colors.grey0,
          borderColor: theme.colors.grey0,
        },
      ]}
    >
      <View style={styles.exerciseHeader}>
        <Pressable
          onPress={async () =>
            router.push({
              pathname: "/(tabs)/(workout)/exercise",
              params: {
                exerciseId: exercise.id,
                planId: plan.id,
                route: "exercise",
                workoutTime: workoutTime,
              },
            })
          }
        >
          <Text style={[styles.baseText, { color: theme.colors.black }]}>
            {exercise.name}
          </Text>
        </Pressable>
        {!isDisabled && (
          <ThreeDotsModal options={exerciseBottomSheetOptions} theme={theme} />
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Input
                disabled={isDisabled}
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputRoundedContainer}
                inputStyle={[styles.input, { color: theme.colors.black }]}
                onChangeText={(value) =>
                  updateSets(
                    setIndex,
                    "reps",
                    parseInt(value) ? parseInt(value) : 0
                  )
                }
                value={set?.reps?.toString()}
              />
              {!exercise.cardio ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: theme.colors.black }}>x</Text>
                  <Input
                    disabled={isDisabled}
                    keyboardType="numeric"
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.inputRoundedContainer}
                    inputStyle={[styles.input, { color: theme.colors.black }]}
                    onChangeText={(value) =>
                      updateSets(
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
                        ? Math.floor(set.weight_duration / 2.205)?.toString()
                        : Math.floor(set.weight_duration)?.toString()
                    }
                  />
                  <Text style={{ color: theme.colors.black }}>
                    {isWeightMetric ? "kg" : "lbs"}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={{ color: theme.colors.black }}>m</Text>
                  <Input
                    disabled={isDisabled}
                    keyboardType="numeric"
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.inputRoundedContainer}
                    inputStyle={[styles.input, { color: theme.colors.black }]}
                    onChangeText={(value) =>
                      updateSets(
                        setIndex,
                        "weight_duration",
                        parseFloat(value) ? parseFloat(value) : 0
                      )
                    }
                    value={set?.weight_duration?.toString()}
                  />
                  <Text style={{ color: theme.colors.black }}>s</Text>
                </View>
              )}
            </View>
            {!isDisabled && (
              <ThreeDotsModal
                options={[
                  {
                    title: "Delete Set",
                    onPress: () => {
                      handleDeleteSet(setIndex);
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
                ]}
                theme={theme}
              />
            )}
          </View>
        ))}
        {!isDisabled ? (
          <EmptySetCard
            onPress={() =>
              handleAddSet(exercise.id, sets[sets.length - 1]?.weight_duration)
            }
          />
        ) : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 20,
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
