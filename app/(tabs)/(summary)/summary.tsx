import React, { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { daysAgo, getWorkoutSummaryData } from "../../../backend/workout";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  startOfWeek,
} from "date-fns";
import { ChartData, Workout } from "../../../components/types";
import WorkoutSummaryChart from "../../../components/WorkoutSummaryChart";
import { useTheme } from "@rneui/themed";
import { useFocusEffect } from "expo-router";

export default function WorkoutSummary() {
  const { theme } = useTheme();

  const [weeklyWorkoutData, setWeeklyWorkoutData] = useState<ChartData[]>();
  const [monthlyWorkoutData, setMonthlyWorkoutData] = useState<ChartData[]>();
  const [yearlyWorkoutData, setYearlyWorkoutData] = useState<ChartData[]>();

  function processWorkoutData(
    workouts: Workout[],
    period: "daily" | "weekly" | "monthly"
  ): ChartData[] {
    const groupedData: {
      [key: number]: { x: number; y: number };
    } = {};

    for (let i = 0; i < 7; i++) {
      groupedData[i] = {
        x: i,
        y: 0,
      };
    }
    workouts.forEach((workout) => {
      const workoutDate = workout.date;
      const x =
        period === "daily"
          ? 6 - differenceInDays(new Date(), workoutDate)
          : period === "weekly"
          ? 6 -
            differenceInWeeks(startOfWeek(new Date()), startOfWeek(workoutDate))
          : 6 - differenceInMonths(new Date(), workoutDate);
      groupedData[x].y += workout.duration;
    });

    const workoutChartData = Object.values(groupedData).map((item) => ({
      x: item.x,
      y: item.y,
    }));
    return workoutChartData;
  }

  async function fetchData() {
    const workoutData = await getWorkoutSummaryData(daysAgo(365), new Date());

    const dailyWorkouts = workoutData.filter(
      (workout) => differenceInDays(new Date(), workout.date) <= 6
    );

    const weeklyWorkouts = workoutData.filter(
      (workout) => differenceInWeeks(new Date(), workout.date) <= 6
    );

    const monthlyWorkouts = workoutData.filter(
      (workout) => differenceInMonths(new Date(), workout.date) <= 6
    );

    setWeeklyWorkoutData(processWorkoutData(dailyWorkouts, "daily"));
    setMonthlyWorkoutData(processWorkoutData(weeklyWorkouts, "weekly"));
    setYearlyWorkoutData(processWorkoutData(monthlyWorkouts, "monthly"));
  }

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Text>Workout Summary</Text>
        {yearlyWorkoutData?.length > 0 ? (
          <WorkoutSummaryChart
            theme={theme}
            dailyChartData={weeklyWorkoutData}
            weeklyChartData={monthlyWorkoutData}
            monthlyChartData={yearlyWorkoutData}
          />
        ) : null}
      </SafeAreaView>
    </View>
  );
}
