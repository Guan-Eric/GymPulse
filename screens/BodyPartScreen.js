import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Appearance,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, getDoc, getDocs, where } from "firebase/firestore";

function BodyPartScreen({ route, navigation }) {
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [exercises, setExercises] = useState([]);
  const bodyPart = route.params.item.name.toLowerCase();

  const ref = collection(FIRESTORE_DB, "Exercises");
  const list = getDocs("primaryMuscles", "array-contains", bodyPart);
  setExercises(list);
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.baseText}>{bodyPart}</Text>
        <View>
          <FlatList
            data={exercises}
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
            columnWrapperStyle={{
              justifyContent: "space-around",
            }}
            renderItem={({ item }) => (
              <Pressable
                key={item.key}
                onPress={() => navigation.navigate("Exercise", { item })}
              >
                <Text style={styles.baseText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default BodyPartScreen;
