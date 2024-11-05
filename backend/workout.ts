import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { Exercise, Workout } from "../components/types";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

export async function getWorkout(workoutId): Promise<Workout> {
  try {
    const workoutDoc = await getDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Workouts/${workoutId}`
      )
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
