import { Card } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

function PlanCard({ plan, theme }) {
  return (
    <Pressable
      key={plan.name}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(workout)/plan",
          params: {
            planId: plan.id,
          },
        })
      }
    >
      <Card
        containerStyle={[
          styles.card,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Card.Title style={[styles.planName, { color: theme.colors.black }]}>
          {plan.name}
        </Card.Title>

        <View style={styles.daysContainer}>
          {plan?.days?.map((item) => (
            <Text
              key={item.name}
              style={[styles.dayText, { color: theme.colors.black }]}
            >
              {item.name}
            </Text>
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    width: 150,
    height: 200,
  },
  planName: {
    fontFamily: "Lato_700Bold",
    fontSize: 20,
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 10,
  },
  dayText: {
    fontFamily: "Lato_400Regular",
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PlanCard;
