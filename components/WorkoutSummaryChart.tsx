import React, { useEffect, useState } from "react";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { ChartData } from "./types";
import { View } from "react-native";
import { Circle, Text, useFont } from "@shopify/react-native-skia";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { ButtonGroup } from "@rneui/themed";
import { format, subDays, subMonths, subWeeks } from "date-fns";
import { useDerivedValue } from "react-native-reanimated";

interface WorkoutSummaryChartProps {
  dailyChartData: ChartData[];
  weeklyChartData: ChartData[];
  monthlyChartData: ChartData[];
  theme;
}

const WorkoutSummaryChart: React.FC<WorkoutSummaryChartProps> = ({
  dailyChartData,
  weeklyChartData,
  monthlyChartData,
  theme,
}) => {
  const font = useFont(Lato_400Regular, 12);
  const chartFont = useFont(Lato_700Bold, 24);

  const dailyTransformData = dailyChartData.map(({ x, y }) => ({ x, y }));
  const weeklyTransformData = weeklyChartData.map(({ x, y }) => ({ x, y }));
  const monthlyTransformData = monthlyChartData.map(({ x, y }) => ({ x, y }));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { state, isActive } = useChartPressState({ x: 0, y: { y: 0 } });
  const [transformedData, setTransformedData] = useState(dailyTransformData);

  useEffect(() => {
    switch (selectedIndex) {
      case 0:
        setTransformedData(dailyTransformData);
        break;
      case 1:
        setTransformedData(weeklyTransformData);
        break;
      case 2:
        setTransformedData(monthlyTransformData);
        break;
    }
  }, [selectedIndex, dailyChartData, weeklyChartData, monthlyChartData]);
  const timeLabel = (timeValue: number) => {
    const hours = Math.floor(timeValue / 3600);
    const minutes = Math.floor((timeValue % 3600) / 60);
    const seconds = timeValue % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m` as string;
    } else return `${minutes}m ${seconds}s` as string;
  };
  const value = useDerivedValue(() => {
    if (!isActive) {
      const latestDataPoint = transformedData[transformedData.length - 1];
      timeLabel(latestDataPoint?.y || 0);
    } else {
      timeLabel(state.y.y.value.value);
    }
  }, [state]);

  return (
    <View style={{ height: 300 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <ButtonGroup
          containerStyle={{ width: 200, height: 30 }}
          buttons={["Daily", "Weekly", "Monthly"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
        />
      </View>
      <CartesianChart
        data={transformedData}
        xKey="x"
        yKeys={["y"]}
        domainPadding={{ top: 30 }}
        xAxis={{
          lineColor: theme.colors.grey0,
          font: font,
          labelColor: theme.colors.black,
          formatXLabel(label) {
            if (selectedIndex === 0) {
              return format(subDays(new Date(), 6 - label), "EE");
            } else if (selectedIndex === 1) {
              return format(subWeeks(new Date(), 6 - label), "MMM dd");
            } else {
              return format(subMonths(new Date(), 6 - label), "MMM");
            }
          },
        }}
        yAxis={[
          {
            lineColor: theme.colors.grey0,
            font: font,
            labelColor: theme.colors.black,
            formatYLabel(label) {
              timeLabel(label);
            },
          },
        ]}
        chartPressState={state}
      >
        {({ points }) => (
          <>
            <Text
              x={100}
              y={60}
              font={chartFont}
              text={value}
              color={theme.colors.black}
            />
            <Line
              points={points.y}
              color={theme.colors.primary}
              strokeWidth={3}
              animate={{ type: "timing", duration: 500 }}
            />
            {isActive ? (
              <Circle
                cx={state.x.position}
                cy={state.y.y.position}
                r={8}
                color={theme.colors.primary}
                opacity={0.8}
              />
            ) : null}
          </>
        )}
      </CartesianChart>
    </View>
  );
};

export default WorkoutSummaryChart;
