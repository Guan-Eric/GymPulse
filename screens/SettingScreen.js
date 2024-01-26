import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Appearance } from "react-native";
import { theme } from "../styles/Theme";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "@rneui/themed";
import { RadioGroup } from "react-native-radio-buttons-group";
import { CheckBox } from "@rneui/base";
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
  const [styles, setStyles] = useState(
    Appearance.getColorScheme() == "light" ? theme.lightMode : theme.darkMode
  );
  const [metric, setMetric] = useState();
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
  const setDarkMode = async (value) => {
    setStyles(value);
    Appearance.setColorScheme(value);
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      darkMode: value,
    });
  };
  const setMetricMode = async (value) => {
    setMetric(value);
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, {
      metricUnits: value,
    });
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text>SettingScreen</Text>
        <CheckBox
          checked={styles == "dark"}
          onPress={() => setDarkMode("dark")}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Dark Theme"}
        />
        <CheckBox
          checked={styles == "light"}
          onPress={() => setDarkMode("light")}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Light Theme"}
        />
        <CheckBox
          checked={styles == null}
          onPress={() => setDarkMode(null)}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Use Device Settings"}
        />
        <CheckBox
          checked={metric == true}
          onPress={() => setMetricMode(true)}
          iconType="material-community"
          checkedIcon="radiobox-marked"
          uncheckedIcon="radiobox-blank"
          title={"Metric Units"}
        />
        <CheckBox
          checked={metric == false}
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

export default SettingScreen;
