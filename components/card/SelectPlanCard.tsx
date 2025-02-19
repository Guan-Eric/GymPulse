import { Button, Card } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, View, Text, StyleSheet, ScrollView } from "react-native";
import SelectPlanModal from "../modal/SelectPlanModal";

function SelectPlanCard({ plans, theme, setPlan, plan }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button type="clear" onPress={() => setIsModalOpen(true)}>
        <Card
          containerStyle={[
            styles.card,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.greyOutline,
            },
          ]}
        >
          {plan ? (
            <>
              <Text
                style={[
                  styles.planName,
                  { color: theme.colors.black, alignSelf: "center" },
                ]}
              >
                Current Selection:
              </Text>
              <Text
                style={[
                  styles.planName,
                  {
                    color: theme.colors.black,
                    marginBottom: 0,
                    flexWrap: "wrap",
                    alignSelf: "center",
                  },
                ]}
              >
                {plan?.name}
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.title,
                { color: theme.colors.primary, alignSelf: "center" },
              ]}
            >
              Select Plan
            </Text>
          )}
        </Card>
      </Button>
      <SelectPlanModal
        modalVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plans={plans}
        theme={theme}
        setPlan={setPlan}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
    width: "96%",
  },
  planName: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 24,
    marginBottom: 0,
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

export default SelectPlanCard;
