import {
  doc,
  collection,
  onSnapshot,
  getDocs,
  updateDoc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Exercise, Plan } from "../components/types";
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
    for (const docSnapshot of querySnapshot.docs) {
      const plan: Plan = docSnapshot.data() as Plan;
      const exercisesCollection = collection(docSnapshot.ref, "Exercise");
      const exercisesSnapshot = await getDocs(exercisesCollection);
      const exercisesData = [] as Exercise[];

      for (const exerciseDoc of exercisesSnapshot.docs) {
        const exerciseData = exerciseDoc.data() as Exercise;
        exercisesData.push(exerciseData);
      }
      plan.exercises = exercisesData;
      plans.push(plan as Plan);
    }
    return plans;
  } catch (error) {
    console.error("Error fetching plans from Firestore:", error);
  }
}

export async function createPlan(): Promise<Plan> {
  try {
    const docRef = await addDoc(
      collection(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}/Plans`),
      {
        name: "New Plan",
        userId: FIREBASE_AUTH.currentUser.uid,
      }
    );
    const planDoc = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${docRef.id}`
    );
    await updateDoc(planDoc, { id: docRef.id });
    const plan = (await getDoc(planDoc)).data() as Plan;
    return plan;
  } catch (error) {
    console.error("Error adding document: ", error);
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

    const exercisesCollection = collection(planDoc.ref, "Exercise");
    const exercisesSnapshot = await getDocs(exercisesCollection);
    const exercisesData = [] as Exercise[];

    for (const exerciseDoc of exercisesSnapshot.docs) {
      const exerciseData = exerciseDoc.data() as Exercise;
      exercisesData.push(exerciseData);
    }
    plan.exercises = exercisesData;
    return plan;
  } catch (error) {
    console.error("Error fetching plan data:", error);
  }
}

export async function savePlan(plan: Plan) {
  const planDocRef = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}`
  );
  updateDoc(planDocRef, {
    id: plan.id,
    name: plan.name,
    userId: FIREBASE_AUTH.currentUser.uid,
  });

  for (const exerciseKey in plan.exercises) {
    const exercise = plan.exercises[exerciseKey];
    const exerciseDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Exercise/${exercise.id}`
    );
    updateDoc(exerciseDocRef, {
      cardio: exercise.cardio,
      planId: plan.id,
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets,
    });
  }
}

export async function deletePlan(plan: Plan) {
  const planDocRef = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}`
  );
  deleteDoc(planDocRef);
}

export async function addSet(plan: Plan, exerciseId: string) {
  const exerciseDoc = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Exercise/${exerciseId}`
  );
  const exerciseDocSnap = await getDoc(exerciseDoc);

  if (exerciseDocSnap.exists()) {
    const currentSets = exerciseDocSnap.data().sets || [];
    const newSets = [...currentSets, { reps: 0, weight_duration: 0 }];
    await updateDoc(exerciseDoc, { sets: newSets });
    const updatedPlan = {
      ...plan,
      exercises: plan.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: newSets } : ex
      ),
    };

    return updatedPlan;
  }
}

export async function deleteExercise(
  plan: Plan,
  exerciseId: string
): Promise<Plan> {
  try {
    const exerciseDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Exercise/${exerciseId}`
    );
    await deleteDoc(exerciseDocRef);

    const updatedExercises = plan.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );

    updatedExercises.sort((a, b) => a.index - b.index);

    updatedExercises.forEach((exercise, index) => {
      exercise.index = index;
    });

    const planDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}`
    );
    const exercisesCollectionRef = collection(planDocRef, "Exercise");

    updatedExercises.forEach(async (exercise) => {
      const exerciseDocRef = doc(exercisesCollectionRef, exercise.id);
      await updateDoc(exerciseDocRef, { index: exercise.index });
    });

    return { ...plan, exercises: updatedExercises };
  } catch (error) {
    console.error("Error deleting exercise:", error);
  }
}

export function deleteSet(plan: Plan, exerciseId, setIndex): Plan {
  return {
    ...plan,
    exercises: plan.exercises.map((prevExercise) =>
      prevExercise.id === exerciseId
        ? {
            ...prevExercise,
            sets: prevExercise.sets.filter(
              (_set, sIndex) => sIndex !== setIndex
            ),
          }
        : prevExercise
    ),
  };
}

export function updateSet(plan: Plan, exerciseId, setIndex, property, value) {
  const updatedPlan = {
    ...plan,
    exercises: plan.exercises.map((prevExercise) =>
      prevExercise.id === exerciseId
        ? {
            ...prevExercise,
            sets: prevExercise.sets.map((prevSet, sIndex) =>
              sIndex === setIndex ? { ...prevSet, [property]: value } : prevSet
            ),
          }
        : prevExercise
    ),
  };

  return updatedPlan;
}

export async function fetchExercise(exerciseId: string): Promise<Exercise> {
  const exerciseDoc = await getDoc(
    doc(FIRESTORE_DB, `Exercises/${exerciseId}`)
  );
  return exerciseDoc.data() as Exercise;
}
