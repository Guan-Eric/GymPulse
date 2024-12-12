import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { ScreenWidth } from "@rneui/base";
import { useTheme } from "@rneui/themed";

const FeedLoader = ({ theme }) => (
  <ContentLoader
    speed={2}
    width={ScreenWidth}
    height={ScreenWidth * 1.25 + 40}
    backgroundColor={theme?.colors.grey1}
    foregroundColor={theme?.colors.grey0}
  >
    <Rect
      x="20"
      y="40"
      rx="20"
      ry="20"
      width={ScreenWidth - 40}
      height={ScreenWidth * 1.25}
    />
  </ContentLoader>
);

export default FeedLoader;
