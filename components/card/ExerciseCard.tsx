import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Button, Icon, useTheme } from "@rneui/themed";
import ExerciseCarousel from "../ExerciseCarousel";
import BackButton from "../BackButton";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
function ExerciseCard({ exercise, imageUrls, route, handleAddExercise }) {
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 10,
          marginBottom: 10,
        }}
      >
        <BackButton />
        <Text style={[styles.title, { color: theme.colors.black }]}>
          {capitalizeFirstLetter(exercise?.name)}
        </Text>
        {route == "add" ? (
          <Button
            type="clear"
            icon={
              <Icon
                name="plus"
                type="material-community"
                color={theme.colors.primary}
              />
            }
            onPress={handleAddExercise}
          />
        ) : (
          <Button type="clear" buttonStyle={{ width: 45 }} />
        )}
      </View>
      <ScrollView>
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
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    width: "75%",
    flexWrap: "wrap",
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
