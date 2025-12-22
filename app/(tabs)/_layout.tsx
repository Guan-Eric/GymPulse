// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="(skills)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3490de",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#181818",
          borderTopColor: "#2b2b2b",
        },
      }}
    >
      <Tabs.Screen
        name="(skills)"
        options={{
          title: "Skills",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(strength)"
        options={{
          title: "Strength",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(progress)"
        options={{
          title: "Progress",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="chart-line"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
