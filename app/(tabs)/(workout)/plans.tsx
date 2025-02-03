import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  Pressable,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, SearchBar, Tab, TabView, useTheme, Image } from "@rneui/themed";
import { createPlan, getPlans } from "../../../backend/plan";
import PlanCard from "../../../components/card/PlanCard";
import EmptyPlanCard from "../../../components/card/EmptyPlanCard";
import BodyPartCard from "../../../components/card/BodyPartCard";
import { Exercise, Plan } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";
import PlansLoader from "../../../components/loader/PlansLoader";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_STR, FIRESTORE_DB } from "../../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { ScreenWidth } from "@rneui/base";

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

function PlanScreen() {
  const [search, setSearch] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [results, setResults] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [imageUrls, setImageUrls] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  const fetchPlans = async () => {
    try {
      setPlans(await getPlans());
    } catch (error) {
      console.error("Error fetching plans", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans();
    fetchExercisesFromFirestore();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );

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
    if (search.trim() === "") {
      setResults(exercises);
    } else {
      const filteredExercises = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filteredExercises);
    }
  }, [search, exercises]);

  const handleCreatePlan = async () => {
    const newPlan = await createPlan("New Plan");
    setPlans((prevPlans) => [...prevPlans, newPlan]);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          marginBottom: Platform.OS == "ios" ? -35 : 0,
        },
      ]}
    >
      <SafeAreaView style={[styles.container, { flex: 1 }]}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: theme.colors.black,
          }}
        >
          <Tab.Item
            title="Exercises"
            titleStyle={{
              fontSize: 24,
              color: theme.colors.black,
              fontFamily: "Lato_700Bold",
            }}
          />
          <Tab.Item
            title="Plans"
            titleStyle={{
              fontSize: 24,
              color: theme.colors.black,
              fontFamily: "Lato_700Bold",
            }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex}>
          <TabView.Item style={{ flex: 1 }}>
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
                      marginTop: 15,
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
                        params: { bodypart: item.name, route: "exercise" },
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
                      marginTop: 15,
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
                          planId: null,
                          route: "exercise",
                          workoutTime: null,
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
                      <Text
                        style={[styles.baseText, { color: theme.colors.black }]}
                      >
                        {item.name}
                      </Text>
                    </Card>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </TabView.Item>
          <TabView.Item style={{ flex: 1 }}>
            {loading ? (
              <View style={styles.planContainer}>
                <View style={styles.planCardWrapper}>
                  <PlansLoader theme={theme} />
                </View>
              </View>
            ) : (
              <ScrollView>
                <View style={styles.planContainer}>
                  {plans?.length == 0
                    ? null
                    : plans?.map((item) => (
                        <View key={item.id} style={styles.planCardWrapper}>
                          <PlanCard plan={item} theme={theme} />
                        </View>
                      ))}
                  <View key="empty-plan-card" style={styles.planCardWrapper}>
                    <EmptyPlanCard onPress={handleCreatePlan} />
                  </View>
                </View>
              </ScrollView>
            )}
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    paddingLeft: 10,
    fontFamily: "Lato_400Regular",
    fontSize: 16,
    textAlign: "center",
    wordWrap: "break-word",
  },
  titleText: {
    fontFamily: "Lato_700Bold",
    fontSize: 24,
    paddingLeft: 10,
  },
  logoText: {
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
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
  planContainer: {
    alignContent: "center",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  planCardWrapper: {
    width: "96%",
    marginBottom: 20,
  },
});
export default PlanScreen;
