import { Card } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { Pressable, View, Text, StyleSheet, ScrollView } from "react-native";

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
          {
            backgroundColor: theme.colors.grey0,
            borderColor: theme.colors.greyOutline,
          },
        ]}
      >
        <Card.Title style={[styles.planName, { color: theme.colors.black }]}>
          {plan.name}
        </Card.Title>

        <View style={styles.daysContainer}>
          <ScrollView style={{ maxHeight: 135 }}>
            {plan?.exercises
              ?.slice()
              .sort((a, b) => a.index - b.index)
              .map((item) => (
                <Text
                  key={item.id}
                  style={[styles.exerciseText, { color: theme.colors.black }]}
                >
                  {item.name}
                </Text>
              ))}
          </ScrollView>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    width: "96%",
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
  exerciseText: {
    fontFamily: "Lato_400Regular",
    fontSize: 14,
    marginBottom: 5,
  },
});

export default PlanCard;
