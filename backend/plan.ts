import {
  doc,
  collection,
  onSnapshot,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Day, Exercise, Plan } from "../components/types";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

export async function getPlans(): Promise<Plan[]> {
  try {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );

    const plansCollectionRef = collection(userDocRef, "Plans");
    const querySnapshot = await getDocs(plansCollectionRef);

    const plans: Plan[] = [];
    querySnapshot.forEach((doc) => {
      plans.push(doc.data() as Plan);
    });

    return plans;
  } catch (error) {
    console.error("Error fetching plans from Firestore:", error);
  }
}

export async function getMetric(): Promise<boolean> {
  try {
    const userDoc = await getDoc(
      doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`)
    );
    const userData = userDoc.data();
    return userData.metricUnits;
  } catch (error) {
    console.error("Error fetching plan data:", error);
  }
}

export async function getPlan(planId: string): Promise<Plan> {
  try {
    const planDoc = await getDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}`
      )
    );
    const plan = planDoc.data() as Plan;

    const daysCollection = collection(planDoc.ref, "Days");
    const daysSnapshot = await getDocs(daysCollection);
    const daysData = [] as Day[];

    for (const dayDoc of daysSnapshot.docs) {
      const dayData = dayDoc.data() as Day;

      const exercisesCollection = collection(dayDoc.ref, "Exercise");
      const exercisesSnapshot = await getDocs(exercisesCollection);
      const exercisesData = exercisesSnapshot.docs.map(
        (exerciseDoc) => exerciseDoc.data() as Exercise
      );
      dayData.exercises = exercisesData;
      daysData.push(dayData);
    }
    plan.days = daysData;
    return plan;
  } catch (error) {
    console.error("Error fetching plan data:", error);
  }
}

export async function savePlan(days: Day[], planId: string) {
  const planDocRef = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${planId}`
  );
  updateDoc(planDocRef, { name: name });
  for (const day of days) {
    const dayDocRef = doc(planDocRef, `Days/${day.id}`);
    await updateDoc(dayDocRef, { name: day.name });

    for (const exercise of day.exercises) {
      const exerciseDocRef = doc(dayDocRef, `Exercise/${exercise.id}`);
      await updateDoc(exerciseDocRef, {
        name: exercise.name,
        sets: exercise.sets,
      });
    }
  }
}

export async function addDay() {
  // Function code remains unchanged
}

export async function addSet(dayId, exerciseId, days) {
  // Function code remains unchanged
}

export async function deleteDay(dayId) {
  // Function code remains unchanged
}

export async function deleteExercise(dayId, exerciseId) {
  // Function code remains unchanged
}

export function deleteSet(dayIndex, exerciseIndex, setIndex) {
  // Function code remains unchanged
}

export function updateSet(dayIndex, exerciseIndex, setIndex, property, value) {
  // Function code remains unchanged
}

export function updateDay(dayIndex, newName) {
  // Function code remains unchanged
}
