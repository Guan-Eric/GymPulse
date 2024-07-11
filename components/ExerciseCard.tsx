import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { Card, useTheme } from "@rneui/themed";
import Carousel from "react-native-reanimated-carousel";

const screenWidth = Dimensions.get("window").width;
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

  const renderCarouselItem = ({ item }) => (
    <View style={{ width: screenWidth, height: screenWidth }}>
      <Image
        source={{ uri: item.uri }}
        style={{
          alignSelf: "center",
          borderRadius: 20,
          width: screenWidth * 0.95,
          height: (screenWidth * 0.95) / (195 / 130),
          resizeMode: "cover",
        }}
      />
    </View>
  );

  return (
    <View>
      <ScrollView>
        <Carousel
          style={{ alignSelf: "center" }}
          data={imageUrls}
          renderItem={renderCarouselItem}
          width={screenWidth}
          height={screenWidth / (195 / 130)}
          scrollAnimationDuration={1000}
          loop={false}
        />
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {capitalizeFirstLetter(exercise?.name)}
          </Text>
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
