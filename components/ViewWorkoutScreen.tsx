import React, { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Workout } from "../components/types";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@rneui/themed";
import DayCard from "../components/DayCard";
import { getWorkout } from "../backend/workout";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { getUser } from "../backend/user";
import BackButton from "./BackButton";

function ViewWorkoutScreen({ theme, workoutId, userId }) {
  const [workout, setWorkout] = useState<Workout>();
  const [isWeightMetric, setIsWeightMetric] = useState(true);

  const fetchWorkoutFromFirestore = async () => {
    setWorkout(await getWorkout(workoutId as string, userId as string));
    setIsWeightMetric(
      (await getUser(FIREBASE_AUTH.currentUser.uid)).weightMetricUnits
    );
  };
  useEffect(() => {
    fetchWorkoutFromFirestore();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <BackButton />
        <Text style={[styles.titleText, { color: theme.colors.black }]}>
          {String(Math.floor(workout?.duration / 60)).padStart(2, "0")}:
          {String(workout?.duration % 60).padStart(2, "0")}
        </Text>
        <ScrollView>
          <DayCard
            plan={null}
            day={workout}
            theme={theme}
            isWeightMetric={isWeightMetric}
            setPlan={null}
            isWorkout={false}
            isDisabled={true}
            workoutTime={null}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  nameInput: {
    width: "100%",
  },
  titleText: {
    paddingLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ViewWorkoutScreen;
