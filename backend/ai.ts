import Constants from "expo-constants";
import OpenAI from "openai";
import { Exercise, Plan } from "../components/types";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";

const openai = new OpenAI({
  organization: Constants.expoConfig?.extra?.openaiOrganizationId,
  project: Constants.expoConfig?.extra?.openaiProjectId,
  apiKey: Constants.expoConfig?.extra?.openaiApiKey,
});

export async function generatePlan(
  days: number,
  level: string,
  goal: string,
  preference: string
): Promise<Plan> {
  try {
    const collectionRef = collection(FIRESTORE_DB, "Exercises");
    const querySnapshot = await getDocs(collectionRef);
    const exercises = [];

    querySnapshot.forEach((doc) => {
      exercises.push(doc.data());
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a fitness AI that creates personalized workout plans based on user preferences and fitness levels.",
        },
        {
          role: "user",
          content: `
            Create a ${days}-day workout plan for a ${level} user whose goal is ${goal} and these are my preferences: ${preference}.
            Use the following exercises (with IDs and names):
            ${JSON.stringify(exercises, null, 2)}

            Respond in the following JSON format:
            {
            "name": "My Workout Plan",
            "exercises": [
              { "id": "exercise-id", 
               "name": "exercise name", 
               "sets": [
               {reps: "number", weight_duration: "number"},
               ...
               ] },
               ...
            ]
            }`,
        },
      ],
      temperature: 0.7,
    });

    const planContent =
      response.choices[0].message?.content || "No plan generated.";
    console.log(planContent);
    return JSON.parse(planContent) as Plan; // Ensure the output from OpenAI is JSON-parsable
  } catch (error) {
    console.error("Error generating plan:", error);
  }
}

export async function fetchSuggestions(
  bodyPart: string,
  preference: string
): Promise<Exercise[]> {
  try {
    const collectionRef = collection(FIRESTORE_DB, "Exercises");
    const querySnapshot = await getDocs(collectionRef);
    const exercises = [];

    querySnapshot.forEach((doc) => {
      exercises.push(doc.data());
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a fitness AI that provides exercise suggestions for specific body parts and preferences.",
        },
        {
          role: "user",
          content: `Suggest exercises for ${bodyPart} that focus on ${preference}.
          Use the following exercises (with IDs and names):
            ${JSON.stringify(exercises, null, 2)}

            Respond in the following JSON format:
            [{ "id": "exercise-id", 
               "name": "exercise name"},
               ...]`,
        },
      ],
      temperature: 0.7,
    });

    const suggestionsContent =
      response.choices[0].message?.content || "No suggestions found.";
    console.log(suggestionsContent);
    return JSON.parse(suggestionsContent) as Exercise[]; // Ensure the output is JSON
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}
