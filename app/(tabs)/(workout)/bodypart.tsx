import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_STR } from "../../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Exercise } from "../../../components/types";
import { Href, router, useLocalSearchParams } from "expo-router";
import { Card, Divider, SearchBar, useTheme } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";

const screenWidth = Dimensions.get("window").width;

function BodyPartScreen() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [imageUrls, setImageUrls] = useState({});
  const { bodypart, route, planId, dayId } = useLocalSearchParams();

  const bodyPartQuery = (bodypart as string)?.toLowerCase();

  const fetchExercisesFromFirestore = async () => {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const queryRef = query(
        collectionRef,
        where("primaryMuscles", "array-contains", bodyPartQuery)
      );
      const querySnapshot = await getDocs(queryRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
        fetchImage(doc.data().id);
      });
      setExercises(data);
      setResults(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

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

  const { theme } = useTheme();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <SearchBar
            containerStyle={{
              backgroundColor: theme.colors.background,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputContainerStyle={{
              borderRadius: 10,
            }}
            placeholder="Type Here..."
            onChangeText={(text) => setSearch(text)}
            onClear={() => setSearch("")}
            value={search}
          />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            {bodypart}
          </Text>
          <FlatList
            style={{ flex: 1 }}
            data={results}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderTopWidth: 0.5,
                  borderTopColor: "gray",
                }}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/exercise",
                    params: {
                      exerciseId: item.id,
                      planId: planId,
                      dayId: dayId,
                      route: route,
                    },
                  })
                }
              >
                <Image
                  source={{ uri: imageUrls[item.id] }}
                  style={{
                    alignSelf: "center",
                    width: ScreenWidth * 0.2,
                    height: (ScreenWidth * 0.2) / (195 / 130),
                    resizeMode: "cover",
                  }}
                />
                <Text style={[styles.baseText, { color: theme.colors.black }]}>
                  {item.name}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseText: {
    paddingLeft: 10,
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingBottom: 10,
  },
  card: {
    padding: 20,
    borderRadius: 20,
  },
  image: {
    borderRadius: 8,
    width: screenWidth * 0.82,
    height: screenWidth * 0.82 * 0.75,
    alignSelf: "center",
    resizeMode: "cover",
  },
});

export default BodyPartScreen;
