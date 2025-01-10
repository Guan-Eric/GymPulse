import React from "react";
import { Card, Text } from "@rneui/themed";
import { Image, StyleSheet } from "react-native";

const bodyPartImages = {
  Chest: require("../../assets/bodypart/chest.png"),
  "Middle Back": require("../../assets/bodypart/middle_back.png"),
  "Lower Back": require("../../assets/bodypart/lower_back.png"),
  Triceps: require("../../assets/bodypart/triceps.png"),
  Biceps: require("../../assets/bodypart/biceps.png"),
  Shoulders: require("../../assets/bodypart/shoulders.png"),
  Quadriceps: require("../../assets/bodypart/quadriceps.png"),
  Hamstrings: require("../../assets/bodypart/hamstrings.png"),
  Glutes: require("../../assets/bodypart/glutes.png"),
  Neck: require("../../assets/bodypart/neck.png"),
  Abdominals: require("../../assets/bodypart/abdominals.png"),
  Lats: require("../../assets/bodypart/lats.png"),
  Calves: require("../../assets/bodypart/calves.png"),
  Forearms: require("../../assets/bodypart/forearms.png"),
  Adductors: require("../../assets/bodypart/adductors.png"),
  Abductors: require("../../assets/bodypart/abductors.png"),
  Traps: require("../../assets/bodypart/traps.png"),
};

function BodyPartCard({ bodypart, theme }) {
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
      <Card.Title style={[styles.text, { color: theme.colors.black }]}>
        {bodypart}
      </Card.Title>
      <Image source={bodyPartImages[bodypart]} style={styles.image} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    width: 150,
    height: 200,
  },
  image: {
    marginTop: 10,
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  text: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
});

export default BodyPartCard;
