import React, { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider, createTheme, useTheme } from "@rneui/themed";
import { FIREBASE_AUTH } from "./firebaseConfig";
import WelcomeScreen from "./screens/auth/WelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import PlanScreen from "./screens/workout/PlanScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import SettingScreen from "./screens/auth/SettingScreen";
import BodyPartScreen from "./screens/workout/BodyPartScreen";
import WorkoutHistoryScreen from "./screens/history/WorkoutHistoryScreen";
import WorkoutScreen from "./screens/workout/WorkoutScreen";
import ExerciseListScreen from "./screens/workout/ExerciseListScreen";
import ExerciseScreen from "./screens/workout/ExerciseScreen";
import SearchExerciseScreen from "./screens/workout/SearchExerciseScreen";
import ViewPlanScreen from "./screens/workout/ViewPlanScreen";
import AddExerciseScreen from "./screens/workout/AddExercise";
import ViewWorkoutScreen from "./screens/history/ViewWorkoutScreen";
import FeedScreen from "./screens/social/FeedScreen";
import CameraScreen from "./screens/social/CameraScreen";
import CreatePostScreen from "./screens/social/CreatePostScreen";
import ProfileScreen from "./screens/social/ProfileScreen";
import ViewPostScreen from "./screens/social/ViewPostScreen";
import ViewProfileScreen from "./screens/social/viewProfileScreen";
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";
import { Lato_700Bold, Lato_400Regular } from "@expo-google-fonts/lato";

const theme = createTheme({
  lightColors: {
    primary: "#3490de",
    black: "black",
    background: "white",
  },
  darkColors: {
    primary: "#3490de",
    black: "white",
    background: "#181818",
  },
  mode: "light" as "light" | "dark",
});
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#181818",
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{
          title: "Plan",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="notebook" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Exercises"
        component={ExerciseListScreen}
        options={{
          title: "Exercises",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={WorkoutHistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigator() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });
  const [user, setUser] = useState(null);
  theme.mode = useColorScheme();
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          {user ? (
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          ) : (
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
          )}
          {user == null ? (
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          ) : null}
          {user == null ? (
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          ) : null}
          <Stack.Screen
            name="BodyPart"
            component={BodyPartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Exercise"
            component={ExerciseScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchExercise"
            component={SearchExerciseScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewPlan"
            component={ViewPlanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddExercise"
            component={AddExerciseScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Workout"
            component={WorkoutScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="ViewWorkout"
            component={ViewWorkoutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{ headerShown: false }}
          />
          {user ? (
            <Stack.Screen
              name="Settings"
              component={SettingScreen}
              options={{ headerShown: false }}
            />
          ) : null}
          <Stack.Screen
            name="ViewPost"
            component={ViewPostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewProfile"
            component={ViewProfileScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
export default Navigator;