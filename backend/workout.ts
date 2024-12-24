import {
  getDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Exercise, Workout } from "../components/types";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

export async function getWorkout(
  workoutId: string,
  userId: string
): Promise<Workout> {
  try {
    const workoutDoc = await getDoc(
      doc(FIRESTORE_DB, `Users/${userId}/Workouts/${workoutId}`)
    );

    const exercisesCollection = collection(workoutDoc.ref, "Exercise");
    const exercisesSnapshot = await getDocs(exercisesCollection);
    const exercisesData = exercisesSnapshot.docs.map((exerciseDoc) =>
      exerciseDoc.data()
    );
    const workoutData: Workout = {
      date: workoutDoc.data()?.date.toDate(),
      exercises: exercisesData as Exercise[],
      id: workoutDoc.data()?.id,
      name: workoutDoc.data()?.name,
      duration: workoutDoc.data()?.duration,
    };

    return workoutData as Workout;
  } catch (error) {
    console.error("Error fetching workout data:", error);
  }
}

export async function getWorkoutSummaryData(
  startDate: Date,
  endDate: Date
): Promise<Workout[]> {
  const userWorkoutsCollection = collection(
    FIRESTORE_DB,
    `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts`
  );
  const workoutQuery = query(
    userWorkoutsCollection,
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );
  const querySnapshot = await getDocs(workoutQuery);

  const workouts = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      date: doc.data()?.date.toDate(),
      name: doc.data()?.name,
      duration: doc.data()?.duration,
    } as Workout;
  });

  return workouts;
}

export function deleteWorkout(workoutId: string) {
  try {
    deleteDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${workoutId}`
      )
    );
  } catch (error) {
    console.error("Error deleting workout", error);
  }
}

export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
