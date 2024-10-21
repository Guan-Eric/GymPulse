export interface User {
  username: string;
  name: string;
  bio: string;
  id: string;
  email: string;
  primaryHeight: string;
  secondaryHeight: string;
  weight: string;
  heightIsMetric: boolean;
  weightIsMetric: boolean;
  darkMode: boolean;
  url: string;
  currentStreak: number;
  longestStreak: number;
  streakResetDate: Date;
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
}

export interface Set {
  reps: number;
  weight_duration: number;
}
