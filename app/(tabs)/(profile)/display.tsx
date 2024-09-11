import { CheckBox, useTheme, useThemeMode } from "@rneui/themed";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";

function display(props) {
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
      </SafeAreaView>
    </View>
  );
}

export default display;
