import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Appearance,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchExerciseByBodyPart } from "../apis/exerciseDB";

function ExerciseScreen() {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [bodyPart, setBodyPart] = useState([
    { name: "Chest", key: "1", image: require("../assets/chest.png") },
    { name: "Back", key: "2", image: require("../assets/back.png") },
    { name: "Lower Arms", key: "3", image: require("../assets/arms.png") },
    { name: "Upper Arms", key: "4", image: require("../assets/arms.png") },
    { name: "Shoulders", key: "5", image: require("../assets/arms.png") },
    { name: "Waist", key: "6", image: require("../assets/waist.png") },
    { name: "Upper Legs", key: "7", image: require("../assets/upperlegs.png") },
    { name: "Lower Legs", key: "8", image: require("../assets/lowerlegs.png") },
    { name: "Cardio", key: "9", image: require("../assets/cardio.png") },
    { name: "Neck", key: "10", image: require("../assets/neck.png") },
  ]);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Exercise</Text>
        <View>
          <FlatList
            data={bodyPart}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
            columnWrapperStyle={{
              justifyContent: "space-around",
            }}
            renderItem={({ item }) => (
              <Pressable key={item.key}>
                <Image
                  style={{
                    resizeMode: "cover",
                    height: 100,
                    width: 100,
                    tintColor:
                      Appearance.getColorScheme() == "light"
                        ? "black"
                        : "white",
                  }}
                  source={item.image}
                />
                <Text style={styles.baseText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default ExerciseScreen;
