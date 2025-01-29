import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { GeneratedExercise, GeneratedPlan } from "../../../components/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { Button, Icon, Input, useTheme } from "@rneui/themed";
import BackButton from "../../../components/BackButton";
import GeneratedExerciseSetCard from "../../../components/card/GeneratedExerciseSetCard";
import { createPlan, fetchExercise } from "../../../backend/plan";
import AddExistingPlanModal from "../../../components/modal/AddExistingPlanModal";

export default function GeneratedPlanScreen() {
  const { generatePlanId } = useLocalSearchParams();
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan>();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();

  const handleSaveName = async (name: string) => {
    setGeneratedPlan((prevPlan) => ({
      ...prevPlan,
      name: name,
    }));
    await updateDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatePlanId}`
      ),
      {
        name: name,
      }
    );
  };
  const addGeneratedExercisesToPlan = async (
    planId: string,
    generatedExercises: GeneratedExercise[]
  ) => {
    try {
      for (let i = 0; i < generatedExercises.length; i++) {
        const generatedExercise = generatedExercises[i];
        const exercise = await fetchExercise(generatedExercise.id);
        await addDoc(
          collection(
            FIRESTORE_DB,
            `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Exercise`
          ),
          {
            id: exercise.id,
            name: exercise.name,
            sets: generateSets(generatedExercise.sets, generatedExercise.reps),
            cardio: exercise.category === "cardio",
            planId: planId,
            index: i,
          }
        );
        console.log("Added exercise to plan", exercise.name);
      }
    } catch (error) {
      console.error(error, "Error adding generated exercises to plan");
    }
  };

  function generateSets(sets: number, reps: number) {
    const generatedSets = [];
    for (let i = 0; i < sets; i++) {
      generatedSets.push({
        reps: reps,
        weight: 0,
      });
    }
    return generatedSets;
  }
  const savePlan = async () => {
    try {
      setModalVisible(false);
      setLoading(true);
      await updateDoc(
        doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatePlanId}`
        ),
        {
          saved: true,
        }
      );
      const plan = await createPlan(generatedPlan?.name || "");
      await addGeneratedExercisesToPlan(
        plan.id,
        generatedPlan?.exercises || []
      );
      router.push({
        pathname: "/(tabs)/(workout)/plans",
      });
      setLoading(false);
    } catch (error) {
      console.error(error, "Error saving generated plan");
    }
  };
  const handleSavePlan = async () => {
    if (generatedPlan?.saved) {
      console.log("Plan already saved");
      setModalVisible(true);
    } else {
      savePlan();
    }
  };

  useEffect(() => {
    const fetchGeneratedPlan = async () => {
      const planDoc = await getDoc(
        doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatePlanId}`
        )
      );
      if (planDoc.exists()) {
        console.log(planDoc.data());
        setGeneratedPlan(planDoc.data() as GeneratedPlan);
      }

      const generatedExercisesDocs = await getDocs(
        collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatePlanId}/Exercise`
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
      console.log(generatedExercises);
      setGeneratedPlan((prevPlan) => ({
        ...prevPlan,
        exercises: generatedExercises,
      }));
      console.log(generatedExercises);
    };

    fetchGeneratedPlan();
  }, []);

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
              paddingRight: 10,
            }}
          >
            <BackButton />
            <Input
              inputStyle={{ color: theme.colors.black }}
              label={"Plan Name"}
              containerStyle={styles.nameInput}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { borderColor: theme.colors.greyOutline },
              ]}
              onChangeText={handleSaveName}
              value={generatedPlan?.name}
            />
            <Button
              loading={loading}
              type="clear"
              icon={<Icon name="save" size={24} color={theme.colors.white} />}
              onPress={() => handleSavePlan()}
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
        <AddExistingPlanModal
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddPlan={() => savePlan()}
          onCancel={() => setModalVisible(false)}
          theme={theme}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameInput: {
    width: "75%",
  },
  inputContainer: {
    width: 70,
    height: 40,
  },
  inputRoundedContainer: {
    marginTop: 6,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
