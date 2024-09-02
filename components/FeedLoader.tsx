import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { ScreenWidth } from "@rneui/base";
import { useTheme } from "@rneui/themed";

const FeedLoader = ({ theme }) => (
  <ContentLoader
    speed={2}
    width={ScreenWidth}
    height={ScreenWidth * 1.25 + 60}
    backgroundColor={theme?.colors.grey4}
    foregroundColor={theme?.colors.grey3}
  >
    <Circle cx="31" cy="31" r="20" />
    <Rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
    <Rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
    <Rect
      x="0"
      y="60"
      rx="2"
      ry="2"
      width={ScreenWidth}
      height={ScreenWidth * 1.25}
    />
  </ContentLoader>
);

export default FeedLoader;
