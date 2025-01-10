import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Card, Icon, useTheme } from "@rneui/themed";

function EmptyExerciseCard({ onPress }) {
  const { theme } = useTheme();

  return (
    <Card
      containerStyle={[
        styles.card,
        {
          backgroundColor: theme.colors.grey0,
          borderColor: theme.colors.greyOutline,
        },
      ]}
    >
      <Card.Title style={[styles.planName, { color: theme.colors.black }]}>
        Add Exercise
      </Card.Title>
      <View style={styles.iconContainer}>
        <Button type="clear" onPress={onPress}>
          <Icon
            name="plus"
            type="material-community"
            size={24}
            color={theme.colors.primary}
          />
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 20,
  },
  planName: {
    fontFamily: "Lato_400Regular",
    fontSize: 18,
    marginBottom: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default EmptyExerciseCard;
