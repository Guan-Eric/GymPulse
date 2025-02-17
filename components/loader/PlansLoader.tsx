import { Card } from "@rneui/themed";
import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";

const PlanCardLoader = ({ theme }) => {
  return (
    <Card
      containerStyle={[
        styles.cardLoader,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ContentLoader
        speed={2}
        width={360}
        height={200}
        viewBox="0 0 360 200"
        backgroundColor={theme.colors.grey4}
        foregroundColor={theme.colors.grey3}
      >
        <Rect x="5" y="5" rx="5" ry="5" width="300" height="10" />
        <Rect x="0" y="40" rx="5" ry="5" width="310" height="10" />
        <Rect x="0" y="60" rx="5" ry="5" width="290" height="10" />
        <Rect x="0" y="80" rx="5" ry="5" width="300" height="10" />
        <Rect x="0" y="100" rx="5" ry="5" width="280" height="10" />
        <Rect x="0" y="120" rx="5" ry="5" width="310" height="10" />
        <Rect x="0" y="140" rx="5" ry="5" width="300" height="10" />
      </ContentLoader>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardLoader: {
    borderRadius: 10,
    padding: 20,
    width: 360,
    height: 200,
  },
});

export default PlanCardLoader;
