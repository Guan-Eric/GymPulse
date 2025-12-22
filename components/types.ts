// components/types.ts - Simplified for calisthenics focus

export interface User {
  id: string;
  email: string;
  username: string;
  darkMode: boolean;
  premiumUser: boolean;
  currentGoalId?: string; // Single primary goal
}

export interface Skill {
  id: string;
  name: string;
  category: "push" | "pull" | "legs" | "core";
  description: string;
  imageUrl: string;
  progressions: Progression[];
  isPremium: boolean;
}

export interface Progression {
  id: string;
  skillId: string;
  name: string;
  level: number; // 0 = beginner, increases with difficulty
  targetHoldTime?: number; // seconds for static holds
  targetReps?: number; // for dynamic movements
  targetSets?: number;
  description: string;
  cues: string[]; // Form cues
  commonMistakes: string[];
  prerequisites?: string[]; // prerequisite progression IDs
  videoUrl?: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  skillId: string;
  currentProgressionId: string;
  bestHoldTime?: number;
  bestReps?: number;
  lastTrained: Date;
  readiness: "ready" | "soon" | "not-ready"; // Based on prerequisites
}

export interface TrainingSession {
  id: string;
  userId: string;
  date: Date;
  skillId: string;
  progressionId: string;
  sets: SessionSet[];
  duration: number; // total session time in seconds
  notes?: string;
}

export interface SessionSet {
  setNumber: number;
  holdTime?: number; // seconds
  reps?: number;
  restTime: number; // seconds
  completedAt: Date;
}

export interface StrengthPath {
  id: string;
  name: "push" | "pull" | "legs" | "core";
  exercises: Exercise[];
  userLevel: number; // Auto-adjusts based on performance
}

export interface Exercise {
  id: string;
  name: string;
  pathId: string;
  level: number;
  sets: number;
  reps: number;
  videoUrl?: string;
  instructions: string[];
}

// Keep simplified workout tracking
export interface Workout {
  id: string;
  userId: string;
  name: string;
  duration: number;
  date: Date;
  type: "skill" | "strength";
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  reps: number;
  weight?: number;
  holdTime?: number;
}

// Analytics
export interface ProgressSnapshot {
  date: Date;
  skillId: string;
  progressionLevel: number;
  bestPerformance: number; // hold time or reps
}
