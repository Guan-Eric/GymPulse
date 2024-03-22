import React, { useEffect, useState } from "react";
import { replaceTheme } from "tamagui";
import { StyleSheet } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import config from "../../../tamagui.config";
import { View, Button, Checkbox } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

function SettingScreen() {
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
    const newTheme = value ? config.themes.dark : config.themes.light;
    replaceTheme({
      name: "current",
      theme: newTheme,
    });
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
    <View backgroundColor="$bg" style={styles.container}>
      <SafeAreaView>
        <Checkbox checked={isDark} onPress={() => setDarkMode(!isDark)}>
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <Checkbox checked={!isDark} onPress={() => setDarkMode(!isDark)}>
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <Checkbox checked={isMetric} onPress={() => setMetricMode(!isMetric)}>
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <Checkbox
          size="$4"
          checked={!isMetric}
          onPress={() => setMetricMode(!isMetric)}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>

        <Button size={4} onPress={() => FIREBASE_AUTH.signOut()}>
          Log Out
        </Button>
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
