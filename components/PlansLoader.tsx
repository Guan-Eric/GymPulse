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
        width={150}
        height={200}
        viewBox="0 0 150 200"
        backgroundColor={theme.colors.grey4}
        foregroundColor={theme.colors.grey3}
      >
        <Rect x="5" y="5" rx="5" ry="5" width="100" height="10" />
        <Rect x="0" y="50" rx="5" ry="5" width="110" height="10" />
        <Rect x="0" y="70" rx="5" ry="5" width="90" height="10" />
        <Rect x="0" y="90" rx="5" ry="5" width="100" height="10" />
        <Rect x="0" y="110" rx="5" ry="5" width="80" height="10" />
        <Rect x="0" y="130" rx="5" ry="5" width="110" height="10" />
        <Rect x="0" y="150" rx="5" ry="5" width="100" height="10" />
      </ContentLoader>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardLoader: {
    borderRadius: 10,
    padding: 20,
    width: 150,
    height: 200,
  },
});

export default PlanCardLoader;
