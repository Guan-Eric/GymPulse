import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Appearance } from "react-native";
import { darkMode } from "../styles/darkMode";
import { lightMode } from "../styles/lightMode";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "@rneui/themed";
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
  Appearance.getColorScheme() == "light"
    ? (styles = lightMode)
    : (styles = darkMode);
  const [metric, setMetric] = useState();
  const [dark, setDark] = useState();
  useEffect(() => {
    const fetchUserFromFirestore = async () => {
      const userDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );
      const userDocSnapshot = await getDoc(userDocRef);
      setDark(userDocSnapshot.data().darkMode);
      setMetric(userDocSnapshot.data().metricUnits);
    };
    fetchUserFromFirestore();
  }, []);
  const setDarkMode = async () => {
    setDark(!dark);
    Appearance.setColorScheme(dark ? "dark" : "light");
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      darkMode: dark,
    });
  };
  const setMetricMode = async () => {
    setMetric(!metric);
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      metricUnits: metric,
    });
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text>SettingScreen</Text>
        <Switch value={dark} onValueChange={(value) => setDarkMode(value)} />
        <Switch
          value={metric}
          onValueChange={(value) => setMetricMode(value)}
        />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log Out" />
      </SafeAreaView>
    </View>
  );
}

export default SettingScreen;
