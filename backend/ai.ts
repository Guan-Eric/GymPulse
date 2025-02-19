import Constants from "expo-constants";
import OpenAI from "openai";
import {
  Exercise,
  GeneratedExercise,
  GeneratedPlan,
  Plan,
  Workout,
} from "../components/types";
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
import { isExerciseExists } from "./plan";
import Purchases from "react-native-purchases";
import { getUser } from "./user";

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
      return saveGeneratedPlan(plan, level, goal, equipment, preference, count);
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

export async function analysePlan(
  goal: string,
  preference: string,
  planId: string
) {
  console.log("goal", goal);
  console.log("preference", preference);
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const planDocRef = await getDocs(
        collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}/Exercise`
        )
      );
      const planExercises = [] as Exercise[];
      planDocRef.forEach((doc) => {
        planExercises.push({
          instructions: doc.data().instructions,
          secondaryMuscles: doc.data().secondaryMuscles,
          id: doc.data().id,
          name: doc.data().name,
          sets: doc.data().sets,
          cardio: doc.data().cardio,
          category: doc.data().category,
          equipment: doc.data().equipment,
          level: doc.data().level,
          index: doc.data().index,
        });
      });

      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const querySnapshot = await getDocs(collectionRef);
      const exercises = [];

      querySnapshot.forEach((doc) => {
        exercises.push({ id: doc.data().id });
      });

      const workoutDocRef = await getDocs(
        collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts`
        )
      );
      const workouts = [] as Workout[];
      for (const doc of workoutDocRef.docs) {
        const workoutExercises = [] as Exercise[];
        const workoutExerciseDocRef = await getDocs(
          collection(
            FIRESTORE_DB,
            `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${doc.id}/Exercise`
          )
        );
        workoutExerciseDocRef.forEach((exerciseDoc) => {
          workoutExercises.push({
            id: exerciseDoc.data().id,
            instructions: [],
            secondaryMuscles: [],
            name: "",
            sets: exerciseDoc.data().sets,
            cardio: false,
            category: "",
            equipment: "",
            level: "",
            index: 0,
          });
        });
        workouts.push({
          exercises: workoutExercises,
          duration: doc.data().duration,
          date: doc.data().date.toDate(),
          id: "",
          name: doc.data().name,
        });
      }
      console.log(
        `Plan Exercises: ${JSON.stringify(
          planExercises.map((exercise) => ({
            ...exercise,
            sets: exercise.sets
              .map(
                (set) =>
                  `${set.reps} reps of ${Math.floor(
                    set.weight_duration
                  )?.toString()} lbs`
              )
              .join(", "),
          }))
        )} and the following past workouts: ${JSON.stringify(
          workouts.map((workout) => ({
            ...workout,
            exercises: workout.exercises.map((exercise) => ({
              ...exercise,
              sets: exercise.sets
                .map(
                  (set) =>
                    `${set.reps} reps of ${Math.floor(
                      set.weight_duration
                    )?.toString()} lbs`
                )
                .join(", "),
            })),
          }))
        )}`
      );

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a fitness AI that provides analysis and suggestion for a client's workout plan.",
          },
          {
            role: "user",
            content: `Provide analysis and suggestion for ${goal} as goal${
              preference.length > 0
                ? " and other preferences: " + preference
                : "."
            }.
          Use the following plan:
          ${JSON.stringify(
            planExercises.map((exercise) => ({
              ...exercise,
              sets: exercise.sets
                .map(
                  (set) =>
                    `${set.reps} reps of ${Math.floor(
                      set.weight_duration
                    )?.toString()} lbs`
                )
                .join(", "),
            }))
          )} and the following past workouts: ${JSON.stringify(
              workouts.map((workout) => ({
                ...workout,
                exercises: workout.exercises.map((exercise) => ({
                  ...exercise,
                  sets: exercise.sets
                    .map(
                      (set) =>
                        `${set.reps} reps of ${Math.floor(
                          set.weight_duration
                        )?.toString()} lbs`
                    )
                    .join(", "),
                })),
              }))
            )}`,
          },
        ],
        temperature: 0.7,
      });
      console.log(
        response.choices[0].message?.content ||
          "Error performing analysis.\nPlease try again..."
      );
      return (
        response.choices[0].message?.content ||
        "Error performing analysis.\nPlease try again..."
      );
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
  generatedPlan: GeneratedPlan,
  level: string,
  goal: string,
  equipment: string,
  preference: string,
  count: number
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

  let replacedExercises: string[] = [];
  generatedPlan.exercises.forEach(async (exercise) => {
    if (await isExerciseExists(exercise.id)) {
      const generatedExercisesDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/GeneratedPlans/${generatedPlanDocRef.id}/Exercise/${exercise.id}`
      );
      await setDoc(generatedExercisesDocRef, {
        id: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
      });
    } else {
      replacedExercises.push(exercise.id);
    }
  });
  if (replacedExercises.length > 0) {
    generatedPlan = await replaceExercise(
      generatedPlan,
      replacedExercises,
      level,
      goal,
      equipment,
      preference,
      count
    );
  }
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
async function replaceExercise(
  generatedPlan: GeneratedPlan,
  ids: string[],
  level: string,
  goal: string,
  equipment: string,
  preference: string,
  count: number
): Promise<GeneratedPlan> {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const collectionRef = collection(FIRESTORE_DB, "Exercises");
      const querySnapshot = await getDocs(collectionRef);
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
              "You are a personal trainer that finds alternatives for exercises based on user preferences and fitness levels.",
          },
          {
            role: "user",
            content: `
              Find replacements for the following exercises: ${ids.join(
                ", "
              )} where the user has ${level} as level and ${goal} as goal and has ${preference} as preference and ${equipment} as equipment.
              Please select ${count} exercises from the following list:
              ${exercises.map((exercise) => exercise.id).join(", ")}

              Respond in the following format:
              [
                { "id": exercise_id,  
                 "sets": number,
                 "reps": number,
                 ] },
                 ...
                ]`,
          },
        ],
        temperature: 0.7,
      });
      const suggestionsContent =
        response.choices[0].message?.content || "No suggestions found.";
      const exerciseIds = JSON.parse(suggestionsContent) as GeneratedExercise[];
      for (const exercise of exerciseIds) {
        generatedPlan.exercises.push(exercise);
      }
      return generatedPlan;
    } catch (error) {
      attempts++;
      console.error(
        `Error fetching suggestions (attempt ${attempts}/${maxRetries}):`,
        error
      );
    }
  }
}

export async function purchaseSubscription(offering): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(offering);
    if (
      typeof customerInfo.entitlements.active["my_entitlement_identifier"] !==
      "undefined"
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error, `error purchasing ${offering}`);
  }
}
