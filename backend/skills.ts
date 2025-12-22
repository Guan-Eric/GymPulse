// backend/skills.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import {
  Skill,
  Progression,
  UserProgress,
  TrainingSession,
} from "../components/types";

// Get all available skills
export async function getUserSkills(): Promise<Skill[]> {
  try {
    const skillsRef = collection(FIRESTORE_DB, "Skills");
    const querySnapshot = await getDocs(skillsRef);

    const skills: Skill[] = [];
    for (const docSnapshot of querySnapshot.docs) {
      const skillData = docSnapshot.data() as Skill;

      // Get progressions for this skill
      const progressionsRef = collection(
        FIRESTORE_DB,
        `Skills/${docSnapshot.id}/Progressions`
      );
      const progressionsSnapshot = await getDocs(
        query(progressionsRef, orderBy("level", "asc"))
      );

      const progressions = progressionsSnapshot.docs.map(
        (prog) => prog.data() as Progression
      );

      skills.push({
        ...skillData,
        id: docSnapshot.id,
        progressions,
      });
    }

    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

// Get single skill with progressions
export async function getSkill(skillId: string): Promise<Skill | null> {
  try {
    const skillDoc = await getDoc(doc(FIRESTORE_DB, `Skills/${skillId}`));

    if (!skillDoc.exists()) return null;

    const progressionsRef = collection(
      FIRESTORE_DB,
      `Skills/${skillId}/Progressions`
    );
    const progressionsSnapshot = await getDocs(
      query(progressionsRef, orderBy("level", "asc"))
    );

    const progressions = progressionsSnapshot.docs.map(
      (prog) => ({ ...prog.data(), id: prog.id } as Progression)
    );

    return {
      ...skillDoc.data(),
      id: skillDoc.id,
      progressions,
    } as Skill;
  } catch (error) {
    console.error("Error fetching skill:", error);
    return null;
  }
}

// Get single progression
export async function getProgression(
  progressionId: string
): Promise<Progression | null> {
  try {
    // Need to search across all skills since we don't have skillId
    const skillsRef = collection(FIRESTORE_DB, "Skills");
    const skillsSnapshot = await getDocs(skillsRef);

    for (const skillDoc of skillsSnapshot.docs) {
      const progressionDoc = await getDoc(
        doc(FIRESTORE_DB, `Skills/${skillDoc.id}/Progressions/${progressionId}`)
      );

      if (progressionDoc.exists()) {
        return {
          ...progressionDoc.data(),
          id: progressionDoc.id,
        } as Progression;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching progression:", error);
    return null;
  }
}

// Get user's progress for all skills
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  try {
    const progressRef = collection(
      FIRESTORE_DB,
      `Users/${userId}/SkillProgress`
    );
    const snapshot = await getDocs(progressRef);

    return snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
          lastTrained: doc.data().lastTrained?.toDate(),
        } as UserProgress)
    );
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return [];
  }
}

// Get user's progress for specific skill
export async function getUserSkillProgress(
  userId: string,
  skillId: string
): Promise<UserProgress | null> {
  try {
    const progressDoc = await getDoc(
      doc(FIRESTORE_DB, `Users/${userId}/SkillProgress/${skillId}`)
    );

    if (!progressDoc.exists()) return null;

    return {
      ...progressDoc.data(),
      id: progressDoc.id,
      lastTrained: progressDoc.data().lastTrained?.toDate(),
    } as UserProgress;
  } catch (error) {
    console.error("Error fetching skill progress:", error);
    return null;
  }
}

// Initialize user progress for a skill (first time training)
export async function initializeSkillProgress(
  userId: string,
  skillId: string,
  firstProgressionId: string
): Promise<void> {
  try {
    await setDoc(
      doc(FIRESTORE_DB, `Users/${userId}/SkillProgress/${skillId}`),
      {
        userId,
        skillId,
        currentProgressionId: firstProgressionId,
        lastTrained: new Date(),
        readiness: "ready",
        bestHoldTime: 0,
        bestReps: 0,
      }
    );
  } catch (error) {
    console.error("Error initializing skill progress:", error);
  }
}

// Save training session
export async function saveTrainingSession(
  session: Partial<TrainingSession>
): Promise<void> {
  try {
    const sessionRef = collection(
      FIRESTORE_DB,
      `Users/${session.userId}/TrainingSessions`
    );

    const docRef = await addDoc(sessionRef, {
      ...session,
      date: new Date(),
    });

    // Update user's progress
    const progressRef = doc(
      FIRESTORE_DB,
      `Users/${session.userId}/SkillProgress/${session.skillId}`
    );

    const progressDoc = await getDoc(progressRef);

    // Calculate best performance
    const bestHold = Math.max(
      ...session.sets.map((s) => s.holdTime || 0),
      progressDoc.exists() ? progressDoc.data().bestHoldTime || 0 : 0
    );
    const bestReps = Math.max(
      ...session.sets.map((s) => s.reps || 0),
      progressDoc.exists() ? progressDoc.data().bestReps || 0 : 0
    );

    if (progressDoc.exists()) {
      await updateDoc(progressRef, {
        lastTrained: new Date(),
        bestHoldTime: bestHold,
        bestReps: bestReps,
      });
    } else {
      // First time training this skill
      await initializeSkillProgress(
        session.userId,
        session.skillId,
        session.progressionId
      );
    }
  } catch (error) {
    console.error("Error saving training session:", error);
    throw error;
  }
}

// Update progression (when user advances)
export async function updateUserProgression(
  userId: string,
  skillId: string,
  newProgressionId: string
): Promise<void> {
  try {
    const progressRef = doc(
      FIRESTORE_DB,
      `Users/${userId}/SkillProgress/${skillId}`
    );

    await updateDoc(progressRef, {
      currentProgressionId: newProgressionId,
      bestHoldTime: 0, // Reset for new progression
      bestReps: 0,
    });
  } catch (error) {
    console.error("Error updating progression:", error);
    throw error;
  }
}

// Get training history for a skill
export async function getSkillTrainingHistory(
  userId: string,
  skillId: string,
  limit: number = 10
): Promise<TrainingSession[]> {
  try {
    const sessionsRef = collection(
      FIRESTORE_DB,
      `Users/${userId}/TrainingSessions`
    );

    const q = query(
      sessionsRef,
      where("skillId", "==", skillId),
      orderBy("date", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.slice(0, limit).map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
          date: doc.data().date?.toDate(),
        } as TrainingSession)
    );
  } catch (error) {
    console.error("Error fetching training history:", error);
    return [];
  }
}

// Check if user has premium access
export async function checkPremiumAccess(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(FIRESTORE_DB, `Users/${userId}`));
    return userDoc.exists() ? userDoc.data().premiumUser || false : false;
  } catch (error) {
    console.error("Error checking premium:", error);
    return false;
  }
}
