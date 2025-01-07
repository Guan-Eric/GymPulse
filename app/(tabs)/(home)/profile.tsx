import React from "react";
import { useTheme } from "@rneui/themed";
import ProfileScreen from "../../../components/ProfileScreen";
import { useLocalSearchParams } from "expo-router";

function ViewProfileScreen() {
  const { theme } = useTheme();
  const { userId } = useLocalSearchParams();

  return <ProfileScreen theme={theme} userId={userId} tab={"(home)"} />;
}

export default ViewProfileScreen;
