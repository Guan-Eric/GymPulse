import Constants from "expo-constants";
import OpenAI from "openai";
import { Exercise, GeneratedPlan, Plan } from "../components/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

const openai = new OpenAI({
  organization: Constants.expoConfig?.extra?.openaiOrganizationId,
  project: Constants.expoConfig?.extra?.openaiProjectId,
  apiKey: Constants.expoConfig?.extra?.openaiApiKey,
});

export async function generatePlan(
  level: string,
  goal: string,
  category: string[],
  equipment: string,
  count: number,
  preference: string
): Promise<GeneratedPlan> {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const querySnapshot = await getDocs(collectionRef);
      const exercises = [];
      const filteredExercises = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        return category.includes(data.category);
      });
      filteredExercises.forEach((doc) => {
        exercises.push({ id: doc.data().id });
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a fitness AI that creates personalized workout plans based on user preferences and fitness levels.",
          },
          {
            role: "user",
            content: `
              Create a workout plan for a ${level} user whose goal is ${goal} and has ${equipment} as equipment${
              preference.length > 0
                ? " and other preferences: " + preference
                : "."
            }
              Please select ${count} exercises from the following list:
              ${exercises.map((exercise) => exercise.id).join(", ")}

              Respond in the following format:
              {
              "name": name,
              "exercises": [
                { "id": exercise_id,  
                 "sets": number,
                 "reps": number,
                 ] },
                 ...
                ]
              }
              `,
          },
        ],
        temperature: 0.7,
      });

      const planContent =
        response.choices[0].message?.content || "No plan generated.";
      const cleanedJSON = planContent
        .replace(/\/\/.*$/gm, "")
        .replace(/(\r\n|\n|\r)/gm, "");
      const plan = JSON.parse(cleanedJSON) as GeneratedPlan;
      plan.date = new Date();
      return saveGeneratedPlan(plan);
    } catch (error) {
      attempts++;
      console.error(
        `Error generating plan (attempt ${attempts}/${maxRetries}):`,
        error
      );
      if (attempts === maxRetries) {
        throw new Error(
          "Failed to generate plan after multiple attempts. Please try again later."
        );
      }
    }
  }
}

export async function fetchSuggestions(
  bodyPart: string,
  goal: string,
  preference: string
): Promise<Exercise[]> {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const queryRef = query(
        collectionRef,
        where("primaryMuscles", "array-contains", bodyPart.toLowerCase())
      );
      const querySnapshot = await getDocs(queryRef);
      const exercises = [];

      querySnapshot.forEach((doc) => {
        exercises.push({ id: doc.data().id });
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a fitness AI that provides exercise suggestions for specific body parts and preferences.",
          },
          {
            role: "user",
            content: `Suggest exercises for ${goal} as goal${
              preference.length > 0
                ? " and other preferences: " + preference
                : "."
            }.
          Use the following exercises IDs:
          ${exercises.map((exercise) => exercise.id).join(", ")}

            Respond in the following format:
            [{ "id": "exercise-id"},
               ...]`,
          },
        ],
        temperature: 0.7,
      });
      const suggestionsContent =
        response.choices[0].message?.content || "No suggestions found.";
      const exerciseIds = JSON.parse(suggestionsContent);
      return (await generatedExerciseList(exerciseIds)) as Exercise[];
    } catch (error) {
      attempts++;
      console.error(
        `Error fetching suggestions (attempt ${attempts}/${maxRetries}):`,
        error
      );
      if (attempts === maxRetries) {
        throw new Error(
          "Failed to fetch suggestions after multiple attempts. Please try again later."
        );
      }
    }
  }
}

async function saveGeneratedPlan(
  generatedPlan: GeneratedPlan
): Promise<GeneratedPlan> {
  const generatedPlansCollectionRef = collection(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans`
  );
  const generatedPlanDocRef = await addDoc(generatedPlansCollectionRef, {
    userId: FIREBASE_AUTH.currentUser.uid,
    name: generatedPlan.name,
    date: generatedPlan.date,
  });
  await updateDoc(generatedPlanDocRef, { id: generatedPlanDocRef.id });
  generatedPlan.id = generatedPlanDocRef.id;

  generatedPlan.exercises.forEach(async (exercise) => {
    const generatedExercisesDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatedPlanDocRef.id}/Exercise/${exercise.id}`
    );
    await setDoc(generatedExercisesDocRef, {
      id: exercise.id,
      sets: exercise.sets,
      reps: exercise.reps,
    });
  });
  return generatedPlan;
}

async function generatedExerciseList(exerciseIds: any): Promise<Exercise[]> {
  const exercises = [];
  for (const exerciseId of exerciseIds) {
    const exerciseDocRef = doc(FIRESTORE_DB, `Exercises/${exerciseId.id}`);
    const exerciseDoc = await getDoc(exerciseDocRef);
    exercises.push(exerciseDoc.data());
  }
  return exercises;
}
