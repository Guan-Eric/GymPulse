import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import {
  updateDoc,
  getDoc,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Day } from "../../../components/types";
import { router, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button, Icon } from "@rneui/themed";

function ViewPlanScreen() {
  const [name, setName] = useState("");
  const [days, setDays] = useState<Day[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isMetric, setIsMetric] = useState();
  const { userId, planId } = useLocalSearchParams();
  const { theme } = useTheme();

  useEffect(() => {
    if (isDirty) {
      handleSavePlan();
      setIsDirty(false);
    }
  }, [name, days, isDirty]);

  useEffect(() => {
    const fetchPlanFromFirestore = async () => {
      try {
        const userDoc = await getDoc(doc(FIRESTORE_DB, `Users/${userId}`));
        const userData = userDoc.data();
        setIsMetric(userData.metricUnits);
        const planDoc = await getDoc(
          doc(FIRESTORE_DB, `Users/${userId}/Plans/${planId}`)
        );
        const planData = planDoc.data();
        setName(planData.name);

        const daysCollection = collection(planDoc.ref, "Days");
        const daysSnapshot = await getDocs(daysCollection);
        const daysData = [];

        for (const dayDoc of daysSnapshot.docs) {
          const dayData = dayDoc.data();

          const exercisesCollection = collection(dayDoc.ref, "Exercise");
          const exercisesSnapshot = await getDocs(exercisesCollection);
          const exercisesData = exercisesSnapshot.docs.map((exerciseDoc) =>
            exerciseDoc.data()
          );
          dayData.exercises = exercisesData;
          daysData.push(dayData);
        }
        setDays(daysData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchPlanFromFirestore();
  }, []);
  const setNameAndSave = (newName) => {
    setName(newName);
    setIsDirty(true);
  };
  const handleSavePlan = async () => {
    const planDocRef = doc(FIRESTORE_DB, `Users/${userId}/Plans/${planId}`);
    updateDoc(planDocRef, { name: name });
    for (const day of days) {
      const dayDocRef = doc(planDocRef, `Days/${day.id}`);
      await updateDoc(dayDocRef, { name: day.name });

      for (const exercise of day.exercises) {
        const exerciseDocRef = doc(dayDocRef, `Exercise/${exercise.id}`);
        await updateDoc(exerciseDocRef, {
          name: exercise.name,
          sets: exercise.sets,
        });
      }
    }
  };
  const handleAddDay = async () => {
    try {
      const planDoc = doc(FIRESTORE_DB, `Users/${userId}/Plans/${planId}`);
      const daysCollection = collection(planDoc, "Days");
      const daysDocRef = await addDoc(daysCollection, {
        name: "New Day",
        planId: planId,
      });
      const dayDoc = doc(daysCollection, daysDocRef.id);
      await updateDoc(dayDoc, { id: daysDocRef.id });
      const newDayDoc = await getDoc(doc(daysCollection, daysDocRef.id));
      const newDayData = newDayDoc.data();

      setDays((prevDays) => [...prevDays, newDayData] as Day[]);
      setIsDirty(true);
    } catch (error) {
      console.error("Error adding new day:", error);
    }
  };

  const handleAddSet = async (dayId, exerciseId, days) => {
    const exerciseDoc = doc(
      FIRESTORE_DB,
      `Users/${userId}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
    );
    const exerciseDocSnap = await getDoc(exerciseDoc);

    if (exerciseDocSnap.exists()) {
      const currentSets = exerciseDocSnap.data().sets || [];
      const newSets = [...currentSets, { reps: 0, weight_duration: 0 }];
      await updateDoc(exerciseDoc, { sets: newSets });
      const updatedDays = days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, sets: newSets } : ex
              ),
            }
          : day
      );
      setDays(updatedDays);
      setIsDirty(true);
    }
  };

  const handleDeleteDay = async (dayId) => {
    try {
      const dayDocRef = doc(
        FIRESTORE_DB,
        `Users/${userId}/Plans/${planId}/Days/${dayId}`
      );
      const exercisesCollectionRef = collection(dayDocRef, "Exercise");
      const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);

      exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
        await deleteDoc(exerciseDoc.ref);
      });
      await deleteDoc(dayDocRef);
      setDays((prevDays) => prevDays.filter((day) => day.id !== dayId));
      setIsDirty(true);
    } catch (error) {
      console.error("Error deleting day:", error);
    }
  };
  const handleDeleteExercise = async (dayId, exerciseId) => {
    try {
      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${userId}/Plans/${planId}/Days/${dayId}/Exercise/${exerciseId}`
      );
      await deleteDoc(exerciseDocRef);
      setDays((prevDays) =>
        prevDays.map((prevDay) =>
          prevDay.id === dayId
            ? {
                ...prevDay,
                exercises: prevDay.exercises.filter(
                  (exercise) => exercise.id !== exerciseId
                ),
              }
            : prevDay
        )
      );
      setIsDirty(true);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };
  const handleDeleteSet = (dayIndex, exerciseIndex, setIndex) => {
    setDays((prevDays) =>
      prevDays.map((prevDay, dIndex) =>
        dIndex === dayIndex
          ? {
              ...prevDay,
              exercises: prevDay.exercises.map((prevExercise, eIndex) =>
                eIndex === exerciseIndex
                  ? {
                      ...prevExercise,
                      sets: prevExercise.sets.filter(
                        (set, sIndex) => sIndex !== setIndex
                      ),
                    }
                  : prevExercise
              ),
            }
          : prevDay
      )
    );
    setIsDirty(true);
  };
  const updateSets = (dayIndex, exerciseIndex, setIndex, property, value) => {
    setDays((prevDays) =>
      prevDays.map((prevDay, dIndex) =>
        dIndex === dayIndex
          ? {
              ...prevDay,
              exercises: prevDay.exercises.map((prevExercise, eIndex) =>
                eIndex === exerciseIndex
                  ? {
                      ...prevExercise,
                      sets: prevExercise.sets.map((prevSet, sIndex) =>
                        sIndex === setIndex
                          ? { ...prevSet, [property]: value }
                          : prevSet
                      ),
                    }
                  : prevExercise
              ),
            }
          : prevDay
      )
    );
    setIsDirty(true);
  };
  const updateDayName = (dayIndex, newName) => {
    setDays((days) =>
      days.map((day, index) =>
        index === dayIndex ? { ...day, name: newName } : day
      )
    );
    setIsDirty(true);
  };
  const renderSetInputs = (sets, exerciseIndex, dayIndex, exercise) => {
    return (
      <View>
        <View style={styles.setRow}>
          {!exercise.cardio && (
            <View style={{ flexDirection: "row", paddingLeft: 65 }}>
              <Text style={[styles.gridText, { color: theme.colors.black }]}>
                Reps
              </Text>
              <Text style={[styles.gridText, { color: theme.colors.black }]}>
                Weight
              </Text>
            </View>
          )}
          {exercise.cardio && <Text style={styles.baseText}>Duration</Text>}
        </View>
        {sets.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text
              style={[styles.baseText, { color: theme.colors.black }]}
            >{`Set ${setIndex + 1}`}</Text>
            {!exercise.cardio && (
              <Input
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                textAlign={"center"}
                inputStyle={{ alignContent: "center" }}
                onChangeText={(newReps) =>
                  updateSets(dayIndex, exerciseIndex, setIndex, "reps", newReps)
                }
                value={set.reps.toString()}
              />
            )}
            {!exercise.cardio && (
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                x
              </Text>
            )}
            {!exercise.cardio && (
              <Input
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                textAlign={"center"}
                inputStyle={{ alignContent: "center" }}
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
              <Text style={[styles.baseText, { color: theme.colors.black }]}>
                {isMetric ? "kg" : "lbs"}
              </Text>
            )}
            {exercise.cardio && (
              <Input
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                textAlign={"center"}
                inputStyle={{ alignContent: "center" }}
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
              onPress={() => handleDeleteSet(dayIndex, exerciseIndex, setIndex)}
            >
              <Icon name="minus" type="material-community" />
            </Button>
          </View>
        ))}
      </View>
    );
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Input
          containerStyle={styles.planNameInputContainer}
          inputContainerStyle={styles.nameInput}
          onChangeText={(newName) => setNameAndSave(newName)}
          value={name}
        />
        <ScrollView>
          {days.map((day, dayIndex) => (
            <View key={day.id}>
              <View style={{ flexDirection: "row" }}>
                <Input
                  containerStyle={styles.nameInputContainer}
                  inputContainerStyle={styles.nameInput}
                  onChangeText={(newDayName) =>
                    updateDayName(dayIndex, newDayName)
                  }
                  value={day.name}
                />
                <Button
                  title="Start Workout"
                  type="clear"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(workout)/workout",
                      params: {
                        userId: userId,
                        planId: planId,
                        dayId: day.id,
                      },
                    })
                  }
                />
              </View>
              {day.exercises &&
                day.exercises.map((exercise, exerciseIndex) => (
                  <View key={exercise.id}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={[styles.baseText, { color: theme.colors.black }]}
                      >
                        {exercise.name}
                      </Text>
                      <Button
                        type="clear"
                        onPress={() =>
                          handleDeleteExercise(day.id, exercise.id)
                        }
                      >
                        <Icon name="minus" type="material-community" />
                      </Button>
                    </View>
                    {renderSetInputs(
                      exercise.sets,
                      exerciseIndex,
                      dayIndex,
                      exercise
                    )}
                    <Button
                      size="sm"
                      type="outline"
                      style={{ paddingRight: 10, paddingLeft: 10 }}
                      buttonStyle={[styles.button, { borderWidth: 1 }]}
                      title="Add Set"
                      onPress={() => handleAddSet(day.id, exercise.id, days)}
                    />
                  </View>
                ))}
              <Button
                size="sm"
                title="Add Exercise"
                style={{ padding: 10 }}
                buttonStyle={styles.button}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/search",
                    params: {
                      userId: userId,
                      planId: planId,
                      dayId: day.id,
                    },
                  })
                }
              />
              <Button
                color="error"
                size="sm"
                title="Delete Day"
                style={{ padding: 10, paddingTop: 0 }}
                buttonStyle={styles.button}
                onPress={() => handleDeleteDay(day.id)}
              />
            </View>
          ))}
          <Button type="clear" title="Add Day" onPress={handleAddDay} />
        </ScrollView>
      </SafeAreaView>
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
  gridText: {
    fontSize: 20,
    paddingRight: 35,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 50,
  },
  button: {
    borderRadius: 10,
  },
  inputContainer: { width: 75, height: 30 },
  input: { borderWidth: 2, borderRadius: 10, height: 30, borderBottomWidth: 2 },
  planNameInputContainer: {},
  nameInputContainer: { width: 300 },
  nameInput: { borderWidth: 2, borderRadius: 10, borderBottomWidth: 2 },
  setRow: {
    alignContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
});
export default ViewPlanScreen;
