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
    for (const docSnapshot of querySnapshot.docs) {
      const plan: Plan = docSnapshot.data() as Plan;
      const daysCollection = collection(docSnapshot.ref, "Days");
      const daysSnapshot = await getDocs(daysCollection);
      const daysData = [] as Day[];

      for (const dayDoc of daysSnapshot.docs) {
        const dayData = dayDoc.data() as Day;
        daysData.push(dayData);
      }
      plan.days = daysData;
      plans.push(plan as Plan);
    }
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

  for (const dayKey in plan.days) {
    const day = plan.days[dayKey];
    const dayDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Days/${day.id}`
    );
    updateDoc(dayDocRef, { id: day.id, name: day.name, planId: plan.id });
    for (const exerciseKey in day.exercises) {
      const exercise = day.exercises[exerciseKey];
      const exerciseDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Days/${day.id}/Exercise/${exercise.id}`
      );
      updateDoc(exerciseDocRef, {
        cardio: exercise.cardio,
        dayId: day.id,
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
      });
    }
  }
}

export async function deletePlan(plan: Plan) {
  const planDocRef = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}`
  );
  deleteDoc(planDocRef);
}

export async function addDay(plan: Plan): Promise<Plan> {
  try {
    const planDoc = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}`
    );
    const daysCollection = collection(planDoc, "Days");
    const daysDocRef = await addDoc(daysCollection, {
      name: "New Day",
      planId: plan.id,
    });
    const dayDoc = doc(daysCollection, daysDocRef.id);
    await updateDoc(dayDoc, { id: daysDocRef.id });
    const newDayDoc = await getDoc(doc(daysCollection, daysDocRef.id));
    const newDayData = newDayDoc.data() as Day;

    return { ...plan, days: [...(plan?.days || []), newDayData] };
  } catch (error) {
    console.error("Error adding new day:", error);
  }
}

export async function addSet(plan: Plan, dayId, exerciseId, days) {
  const exerciseDoc = doc(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Days/${dayId}/Exercise/${exerciseId}`
  );
  const exerciseDocSnap = await getDoc(exerciseDoc);

  if (exerciseDocSnap.exists()) {
    const currentSets = exerciseDocSnap.data().sets || [];
    const newSets = [...currentSets, { reps: 0, weight_duration: 0 }];
    await updateDoc(exerciseDoc, { sets: newSets });
    const updatedPlan = {
      ...plan,
      days: days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, sets: newSets } : ex
              ),
            }
          : day
      ),
    };
    return updatedPlan;
  }
}

export async function deleteDay(plan: Plan, dayId): Promise<Plan> {
  try {
    const dayDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Days/${dayId}`
    );
    const exercisesCollectionRef = collection(dayDocRef, "Exercise");
    const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);

    exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
      await deleteDoc(exerciseDoc.ref);
    });
    await deleteDoc(dayDocRef);
    return {
      ...plan,
      days: plan.days.filter((day) => day.id !== dayId),
    };
  } catch (error) {
    console.error("Error deleting day:", error);
  }
}

export async function deleteExercise(plan: Plan, dayId, exerciseId) {
  try {
    const exerciseDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${plan.id}/Days/${dayId}/Exercise/${exerciseId}`
    );
    await deleteDoc(exerciseDocRef);
    return {
      ...plan,
      days: plan?.days.map((prevDay) =>
        prevDay.id === dayId
          ? {
              ...prevDay,
              exercises: prevDay.exercises.filter(
                (exercise) => exercise.id !== exerciseId
              ),
            }
          : prevDay
      ),
    };
  } catch (error) {
    console.error("Error deleting exercise:", error);
  }
}

export function deleteSet(plan: Plan, dayIndex, exerciseIndex, setIndex): Plan {
  return {
    ...plan,
    days: plan?.days.map((prevDay, dIndex) =>
      dIndex === dayIndex
        ? {
            ...prevDay,
            exercises: prevDay.exercises.map((prevExercise, eIndex) =>
              eIndex === exerciseIndex
                ? {
                    ...prevExercise,
                    sets: prevExercise.sets.filter(
                      (_set, sIndex) => sIndex !== setIndex
                    ),
                  }
                : prevExercise
            ),
          }
        : prevDay
    ),
  };
}

export function updateSet(
  plan: Plan,
  dayIndex,
  exerciseIndex,
  setIndex,
  property,
  value
) {
  return {
    ...plan,
    days: plan?.days.map((prevDay, dIndex) =>
      dIndex === dayIndex
        ? {
            ...prevDay,
            exercises: prevDay.exercises.map((prevExercise, eIndex) =>
              eIndex === exerciseIndex
                ? {
                    ...prevExercise,
                    sets: prevExercise.sets.map((prevSet, sIndex) =>
                      sIndex === setIndex
                        ? { ...prevSet, [property]: value }
                        : prevSet
                    ),
                  }
                : prevExercise
            ),
          }
        : prevDay
    ),
  };
}

export function updateDay(plan: Plan, dayIndex, newName) {
  return {
    ...plan,
    days: plan?.days.map((day, index) =>
      index === dayIndex ? { ...day, name: newName } : day
    ),
  };
}
