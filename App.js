import React, { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { FIREBASE_AUTH } from "./firebaseConfig";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/SignInScreen";
import PlanScreen from "./screens/PlanScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SettingScreen from "./screens/SettingScreen";
import AIScreen from "./screens/AIScreen";
import BodyPartScreen from "./screens/BodyPartScreen";
import WorkoutHistoryScreen from "./screens/WorkoutHistoryScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import ExerciseListScreen from "./screens/ExerciseListScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import SearchExerciseScreen from "./screens/SearchExerciseScreen";
import ViewPlanScreen from "./screens/ViewPlanScreen";
import AddExerciseScreen from "./screens/AddExercise";

const theme = createTheme({
  lightColors: {
    primary: "#3490de",
    text: "black",
    background: "white",
  },
  darkColors: {
    primary: "#3490de",
    text: "white",
    background: "#181818",
  },
  mode: "light" | "dark",
});
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Plan"
      screenOptions={{ headerShown: false }}
    >
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
        name="AI"
        component={AIScreen}
        options={{
          title: "AI",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="robot" size={size} color={color} />
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
        name="Settings"
        component={SettingScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigator() {
  const [user, setUser] = useState(null);
  theme.mode = useColorScheme();
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  });

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
              options={{ headerShown: false }}
            />
          ) : null}
          {user == null ? (
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
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
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
export default Navigator;
