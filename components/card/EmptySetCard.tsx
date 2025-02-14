import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Button, Card, Icon, useTheme } from "@rneui/themed";

function EmptySetCard({ onPress }) {
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
      <View style={styles.iconContainer}>
        <Button
          type="clear"
          onPress={onPress}
          titleStyle={[styles.planName, { color: theme.colors.black }]}
          buttonStyle={{ margin: -10 }}
        >
          Add Set
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  planName: {
    fontFamily: "Lato_400Regular",
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default EmptySetCard;
