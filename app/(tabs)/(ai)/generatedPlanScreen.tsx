import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GeneratedExercise, GeneratedPlan } from "../../../components/types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { Button, useTheme } from "@rneui/themed";
import BackButton from "../../../components/BackButton";
import GeneratedExerciseSetCard from "../../../components/card/GeneratedExerciseSetCard";
import { fetchExercise } from "../../../backend/plan";

export default function GeneratedPlanScreen() {
  const { generatePlanId } = useLocalSearchParams();
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan>();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchGeneratedPlan = async () => {
      const planDoc = await getDoc(
        doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatePlanId}`
        )
      );
      console.log(planDoc.data());
      if (planDoc.exists()) {
        setGeneratedPlan(planDoc.data() as GeneratedPlan);
      }

      const generatedExercisesDocs = await getDocs(
        collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatePlanId}/Exercises`
        )
      );
      const generatedExercises: GeneratedExercise[] = [];
      for (const exercise of generatedExercisesDocs.docs) {
        const exerciseData = exercise.data();
        const exerciseDetails = await fetchExercise(exerciseData.id);
        const generatedExercise = {
          id: exerciseData.id,
          name: exerciseDetails.name,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
        };
        generatedExercises.push(generatedExercise);
      }
      setGeneratedPlan((prevPlan) => ({
        ...prevPlan,
        exercises: generatedExercises,
      }));
    };

    fetchGeneratedPlan();
  }, [generatePlanId]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BackButton />
            <Text style={[styles.title, { color: theme.colors.black }]}>
              {generatedPlan?.name}
            </Text>
            <Button
              title="Save"
              onPress={() => {
                console.log("Save");
              }}
            />
          </View>
          {generatedPlan?.exercises?.map((exercise, index) => (
            <GeneratedExerciseSetCard
              key={index}
              exercise={exercise}
              theme={theme}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    width: "60%",
    flexWrap: "wrap",
    textAlign: "center",
  },
});
