import React, { useEffect, useState } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import { daysAgo, getWorkoutSummaryData } from "../../../backend/workout";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  format,
  isSameWeek,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChartData, Workout } from "../../../components/types";
import WorkoutSummaryChart from "../../../components/WorkoutSummaryChart";
import { useTheme } from "@rneui/themed";

export default function WorkoutSummary() {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [weeklyWorkoutData, setWeeklyWorkoutData] = useState<ChartData[]>();
  const [monthlyWorkoutData, setMonthlyWorkoutData] = useState<ChartData[]>();
  const [yearlyWorkoutData, setYearlyWorkoutData] = useState<ChartData[]>();

  function processWorkoutData(
    workouts: Workout[],
    period: "daily" | "weekly" | "monthly"
  ): ChartData[] {
    const groupedData: {
      [key: number]: { x: number; y: number; label: string };
    } = {};

    for (let i = 0; i < 7; i++) {
      let label: string;

      if (period === "daily") {
        label = format(subDays(new Date(), 6 - i), "EEEE");
      } else if (period === "weekly") {
        const weekStart = startOfWeek(subWeeks(new Date(), 6 - i));
        label = format(weekStart, "MMM dd");
      } else if (period === "monthly") {
        const monthStart = startOfMonth(subMonths(new Date(), 6 - i));
        label = format(monthStart, "MMM yyyy");
      }

      groupedData[i] = {
        x: i,
        y: 0,
        label: label,
      };
    }
    console.log(groupedData);
    workouts.forEach((workout) => {
      const workoutDate = workout.date;
      const x =
        period === "daily"
          ? 6 - differenceInDays(new Date(), workoutDate)
          : period === "weekly"
          ? 6 - differenceInWeeks(new Date(), workoutDate)
          : 6 - differenceInMonths(new Date(), workoutDate);
      groupedData[x].y += workout.duration;
    });

    const workoutChartData = Object.values(groupedData).map((item) => ({
      x: item.x,
      y: item.y,
      label: item.label,
    }));
    console.log(workoutChartData);
    return workoutChartData;
  }

  useEffect(() => {
    async function fetchData() {
      const workoutData = await getWorkoutSummaryData(daysAgo(365), new Date());

      const weeklyWorkouts = workoutData.filter((workout) =>
        isSameWeek(workout.date, new Date())
      );

      const monthlyWorkouts = workoutData.filter(
        (workout) => workout.date.getDay() + 49 >= new Date().getDay()
      );

      setWeeklyWorkoutData(processWorkoutData(weeklyWorkouts, "daily"));
      setMonthlyWorkoutData(processWorkoutData(monthlyWorkouts, "weekly"));
      setYearlyWorkoutData(processWorkoutData(workoutData, "monthly"));
    }
    fetchData();
  }, []);

  return (
    <View>
      <SafeAreaView>
        <Text>Workout Summary</Text>
        <Button
          title={period}
          onPress={() =>
            setPeriod((prevPeriod) =>
              prevPeriod === "daily"
                ? "weekly"
                : prevPeriod === "weekly"
                ? "monthly"
                : "daily"
            )
          }
        />
        {yearlyWorkoutData?.length > 0 ? (
          <WorkoutSummaryChart
            theme={theme}
            chartData={
              period === "daily"
                ? weeklyWorkoutData
                : period === "weekly"
                ? monthlyWorkoutData
                : yearlyWorkoutData
            }
          />
        ) : null}
      </SafeAreaView>
    </View>
  );
}
