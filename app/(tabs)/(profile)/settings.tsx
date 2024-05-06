import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeMode, useTheme, CheckBox } from "@rneui/themed";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { logOut } from "../../../backend/auth";

function SettingScreen() {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const [isDark, setIsDark] = useState();
  const [isMetric, setIsMetric] = useState();
  useEffect(() => {
    const fetchUserFromFirestore = async () => {
      const userDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );
      const userDocSnapshot = await getDoc(userDocRef);
      setIsDark(userDocSnapshot.data().darkMode);
      setIsMetric(userDocSnapshot.data().metricUnits);
    };
    fetchUserFromFirestore();
  }, []);
  const setDarkMode = async (value) => {
    setMode(value ? "dark" : "light");
    setIsDark(value);
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      darkMode: value,
    });
  };
  const setMetricMode = async (value) => {
    setIsMetric(value);
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      metricUnits: value,
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <CheckBox
          checked={isDark == true}
          onPress={() => setDarkMode(true)}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Dark Theme"}
        />
        <CheckBox
          checked={isDark == false}
          onPress={() => setDarkMode(false)}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Light Theme"}
        />
        <CheckBox
          checked={isMetric == true}
          onPress={() => setMetricMode(true)}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Metric Units"}
        />
        <CheckBox
          checked={isMetric == false}
          onPress={() => setMetricMode(false)}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Imperial Units"}
        />
        <Button onPress={() => logOut()} title="Log Out" />
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontFamily: "Roboto_700Bold",
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
export default SettingScreen;
