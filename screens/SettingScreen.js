import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Appearance } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "@rneui/themed";
import { RadioGroup } from "react-native-radio-buttons-group";
import { CheckBox } from "@rneui/base";
import { useThemeMode, useTheme } from "@rneui/themed";
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

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
        <Text>SettingScreen</Text>
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
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log Out" />
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
