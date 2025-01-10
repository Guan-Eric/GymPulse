import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BodyPartCard from "../../../components/card/BodyPartCard";
import { Card, SearchBar, useTheme, Image } from "@rneui/themed";
import BackButton from "../../../components/BackButton";
import { ScreenWidth } from "@rneui/base";
import search from "../(home)/search";
import { Exercise } from "../../../components/types";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { FIRESTORE_DB, FIREBASE_STR } from "../../../firebaseConfig";

function ExerciseListScreen() {
  const bodyParts = [
    { name: "Chest", key: "1" },
    { name: "Middle Back", key: "2" },
    { name: "Lower Back", key: "3" },
    { name: "Triceps", key: "4" },
    { name: "Biceps", key: "5" },
    { name: "Shoulders", key: "6" },
    { name: "Quadriceps", key: "7" },
    { name: "Hamstrings", key: "8" },
    { name: "Glutes", key: "9" },
    { name: "Neck", key: "10" },
    { name: "Abdominals", key: "11" },
    { name: "Lats", key: "12" },
    { name: "Calves", key: "13" },
    { name: "Forearms", key: "14" },
    { name: "Adductors", key: "15" },
    { name: "Abductors", key: "16" },
    { name: "Traps", key: "17" },
  ];

  const [results, setResults] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState<string>("");
  const [imageUrls, setImageUrls] = useState({});

  const { theme } = useTheme();
  const { route, planId, workoutTime } = useLocalSearchParams();

  const fetchExercisesFromFirestore = async () => {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const querySnapshot = await getDocs(collectionRef);
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
        fetchImage(doc.data().id);
      });
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises from Firestore:", error);
    }
  };

  const fetchImage = async (id) => {
    try {
      const imageRef = ref(FIREBASE_STR, `assets/${id}_0.jpg`);
      const url = await getDownloadURL(imageRef);
      setImageUrls((prevImageUrls) => ({
        ...prevImageUrls,
        [id]: url,
      }));
    } catch (error) {
      console.error("Error getting image URL:", error);
    }
  };

  useEffect(() => {
    fetchExercisesFromFirestore();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setResults(exercises);
    } else {
      const filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filteredExercises);
    }
  }, [search, exercises]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          marginBottom: Platform.OS == "ios" ? -35 : 0,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <BackButton />
        <Text style={[styles.titleText, { color: theme.colors.black }]}>
          Body Part
        </Text>
      </View>
      {search === "" ? (
        <FlatList
          contentContainerStyle={styles.bodypartContainer}
          ListHeaderComponentStyle={{ width: "100%", paddingBottom: 5 }}
          numColumns={1}
          data={bodyParts}
          ListHeaderComponent={
            <SearchBar
              containerStyle={{
                alignSelf: "center",
                backgroundColor: theme.colors.background,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginBottom: -10,
                paddingBottom: 10,
                width: "96%",
              }}
              inputContainerStyle={{
                borderRadius: 10,
              }}
              placeholder="Type Here..."
              onChangeText={(text) => setSearch(text)}
              onClear={() => setSearch("")}
              value={search}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.cardWrapper}
              key={item.key}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(workout)/bodypart",
                  params: {
                    bodypart: item.name,
                    route: route,
                    planId: planId,
                    workoutTime: workoutTime,
                  },
                })
              }
            >
              <BodyPartCard bodypart={item.name} theme={theme} />
            </Pressable>
          )}
          keyExtractor={(item) => item.key}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.exerciseContainer}
          numColumns={1}
          ListHeaderComponentStyle={{ width: "100%" }}
          data={results}
          ListHeaderComponent={
            <SearchBar
              containerStyle={{
                alignSelf: "center",
                backgroundColor: theme.colors.background,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginBottom: -10,
                paddingBottom: 10,
                width: "96%",
              }}
              inputContainerStyle={{
                borderRadius: 10,
              }}
              placeholder="Type Here..."
              onChangeText={(text) => setSearch(text)}
              onClear={() => setSearch("")}
              value={search}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(workout)/exercise",
                  params: {
                    exerciseId: item.id,
                    planId: planId,
                    route: route,
                    workoutTime: workoutTime,
                  },
                })
              }
            >
              <Card
                containerStyle={{
                  borderColor: theme.colors.grey0,
                  backgroundColor: theme.colors.grey0,
                  borderRadius: 20,
                }}
              >
                <Image
                  source={{ uri: imageUrls[item.id] }}
                  style={{
                    borderRadius: 12,
                    alignSelf: "center",
                    width: ScreenWidth * 0.85,
                    height: (ScreenWidth * 0.85) / (195 / 130),
                    resizeMode: "cover",
                    paddingBottom: 10,
                  }}
                />
                <Text style={[styles.baseText, { color: theme.colors.black }]}>
                  {item.name}
                </Text>
              </Card>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  baseText: {
    paddingLeft: 10,
    fontFamily: "Lato_400Regular",
    fontSize: 16,
    textAlign: "center",
    wordWrap: "break-word",
  },
  bodypartContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  exerciseContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
});

export default ExerciseListScreen;
