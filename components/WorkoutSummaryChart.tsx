import React from "react";
import { CartesianChart, Line } from "victory-native";
import { ChartData } from "./types";
import { View } from "react-native";

interface WorkoutSummaryChartProps {
  chartData: ChartData[];
  theme;
}

const WorkoutSummaryChart: React.FC<WorkoutSummaryChartProps> = ({
  chartData,
  theme,
}) => {
  const transformedData = chartData.map(({ x, y }) => ({ x, y }));

  return (
    <View style={{ height: 150 }}>
      <CartesianChart
        data={transformedData}
        xKey="x"
        yKeys={["y"]}
        domain={{ x: [0, 6] }}
        xAxis={{ tickCount: 7 }}
      >
        {({ points }) => (
          <Line
            points={points.y}
            color={theme.colors.primary}
            strokeWidth={3}
            animate={{ type: "timing", duration: 500 }}
            curveType="linear"
          />
        )}
      </CartesianChart>
    </View>
  );
};

export default WorkoutSummaryChart;
