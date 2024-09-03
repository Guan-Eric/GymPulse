import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Workout } from "../components/types";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@rneui/themed";
import DayCard from "../components/DayCard";
import { getWorkout } from "../backend/workout";
import { getMetric } from "../backend/user";
import { FIREBASE_AUTH } from "../firebaseConfig";

function ViewWorkoutScreen({ theme, workoutId }) {
  const [workout, setWorkout] = useState<Workout>();
  const [isMetric, setIsMetric] = useState(true);

  const fetchWorkoutFromFirestore = async () => {
    setWorkout(await getWorkout(workoutId as string));
    setIsMetric(await getMetric(FIREBASE_AUTH.currentUser.uid));
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
        <ScrollView>
          <DayCard
            plan={null}
            day={workout}
            dayIndex={null}
            theme={theme}
            isMetric={isMetric}
            setPlan={null}
            isWorkout={false}
            isDisabled={true}
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
});

export default ViewWorkoutScreen;
