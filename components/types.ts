export interface User {
  username: string;
  name: string;
  bio: string;
  id: string;
  email: string;
  primaryHeight: string;
  secondaryHeight: string;
  weight: string;
  heightMetricUnits: boolean;
  weightMetricUnits: boolean;
  darkMode: boolean;
  url: string;
  currentStreak: number;
  longestStreak: number;
  streakResetDate: Date;
  showStreak: boolean;
  showWorkout: boolean;
  showTermsCondition: boolean;
}

export interface Post {
  id: string;
  urls: string[];
  userId: string;
  caption: string;
  like: boolean;
  numLikes: number;
  numComments: number;
  workoutId: string;
  date: Date;
  title: string;
}

export interface Plan {
  id: string;
  name: string;
  days: Day[];
}

export interface Day {
  id: string;
  name: string;
  exercises: Exercise[];
  index: number;
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  date: Date;
  exercises: Exercise[];
}

export interface Exercise {
  instructions: string[];
  secondaryMuscles: string[];
  id: string;
  name: string;
  sets: Set[];
  cardio: boolean;
  category: string;
  equipment: string;
  level: string;
  index: number;
}

export interface Set {
  reps: number;
  weight_duration: number;
}

export interface ChartData {
  x: number;
  y: number;
}
