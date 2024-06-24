import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, Icon, useTheme } from "@rneui/themed";

function EmptyPlanCard({ onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.cardWrapper}>
      <Card
        containerStyle={[
          styles.card,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Card.Title style={styles.planName}>New Plan</Card.Title>
        <View style={styles.iconContainer}>
          <Icon
            name="plus"
            type="material-community"
            size={40}
            color={theme.colors.primary}
          />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "48%",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    padding: 20,
    width: 150,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  planName: {
    fontFamily: "Lato_700Bold",
    fontSize: 20,
    marginBottom: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default EmptyPlanCard;
