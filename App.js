import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/SignInScreen";
import CreatePlanScreen from "./screens/CreatePlanScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SettingScreen from "./screens/SettingScreen";
import AIScreen from "./screens/AIScreen";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";

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
        component={CreatePlanScreen}
        options={{
          title: "Plan",
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
  const [user, setUser] = (useState < User) | (null > null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigator;
