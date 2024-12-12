import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { ScreenHeight, ScreenWidth } from "@rneui/base";
import { useTheme } from "@rneui/themed";

const PlanLoader = ({ theme }) => (
  <ContentLoader
    speed={2}
    width={ScreenWidth}
    height={ScreenHeight}
    backgroundColor={theme?.colors.grey1}
    foregroundColor={theme?.colors.grey0}
  >
    <Rect x="20" y="20" rx="8" ry="8" width={ScreenWidth - 40} height={40} />
    <Rect
      x="20"
      y="80"
      rx="20"
      ry="20"
      width={ScreenWidth - 40}
      height={ScreenWidth + 30}
    />
  </ContentLoader>
);

export default PlanLoader;
