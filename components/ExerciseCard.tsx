import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import ExerciseCarousel from "./ExerciseCarousel";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
function ExerciseCard({ exercise, imageUrls }) {
  const { theme } = useTheme();

  const instructions = exercise?.instructions.map((item, index) => (
    <Text key={index} style={[styles.text, { color: theme.colors.black }]}>
      {capitalizeFirstLetter(item)}
    </Text>
  ));
  const primaryMuscles = exercise?.primaryMuscles.map((item, index) => (
    <Text key={index} style={[styles.text, { color: theme.colors.black }]}>
      {capitalizeFirstLetter(item)}
    </Text>
  ));
  const secondaryMuscles = exercise?.secondaryMuscles.map((item, index) => (
    <Text key={index} style={[styles.text, { color: theme.colors.black }]}>
      {capitalizeFirstLetter(item)}
    </Text>
  ));

  return (
    <View>
      <ScrollView>
        <Text style={[styles.title, { color: theme.colors.black }]}>
          {capitalizeFirstLetter(exercise?.name)}
        </Text>
        <ExerciseCarousel data={imageUrls} theme={theme} />
        <View style={styles.contentContainer}>
          <Text style={[styles.heading, { color: theme.colors.black }]}>
            Equipment
          </Text>
          <Text style={[styles.text, { color: theme.colors.black }]}>
            {capitalizeFirstLetter(exercise?.equipment)}
          </Text>
          <Text style={[styles.heading, { color: theme.colors.black }]}>
            Primary Muscle
          </Text>
          {primaryMuscles}
          <Text style={[styles.heading, { color: theme.colors.black }]}>
            Secondary Muscles
          </Text>
          {secondaryMuscles}
          <Text style={[styles.heading, { color: theme.colors.black }]}>
            Level
          </Text>
          <Text style={[styles.text, { color: theme.colors.black }]}>
            {capitalizeFirstLetter(exercise?.level)}
          </Text>
          <Text style={[styles.heading, { color: theme.colors.black }]}>
            Instructions
          </Text>
          {instructions}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ExerciseCard;
