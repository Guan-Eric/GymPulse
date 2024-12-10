import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Switch, useTheme, useThemeMode } from "@rneui/themed";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import BackButton from "../../../components/BackButton";

function displaySettings() {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const [isDark, setIsDark] = useState<boolean | undefined>();
  const [isWeightMetric, setIsWeightMetric] = useState<boolean | undefined>();
  const [isHeightMetric, setIsHeightMetric] = useState<boolean | undefined>();
  const [showStreak, setShowStreak] = useState<boolean | undefined>();
  const [showWorkout, setShowWorkout] = useState<boolean | undefined>();

  useEffect(() => {
    const fetchUserSettings = async () => {
      const userDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );
      const userDoc = await getDoc(userDocRef);
      const data = userDoc.data();
      setIsDark(data?.darkMode);
      setIsWeightMetric(data?.weightMetricUnits);
      setIsHeightMetric(data?.heightMetricUnits);
      setShowStreak(data?.showStreak);
      setShowWorkout(data?.showWorkout);
    };

    fetchUserSettings();
  }, []);

  const updateSetting = async (field: string, value: boolean) => {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, { [field]: value });
  };

  const toggleDarkMode = (value: boolean) => {
    setIsDark(value);
    setMode(value ? "dark" : "light");
    updateSetting("darkMode", value);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Display Settings
          </Text>
        </View>
        <Card
          containerStyle={[
            styles.section,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
            Appearance
          </Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.black }]}>
              Enable Dark Mode
            </Text>
            <Switch value={isDark} onValueChange={toggleDarkMode} />
          </View>
        </Card>

        <Card
          containerStyle={[
            styles.section,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
            Units
          </Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.black }]}>
              Use Metric Units for Weight
            </Text>
            <Switch
              value={isWeightMetric}
              onValueChange={(value) => {
                setIsWeightMetric(value);
                updateSetting("weightMetricUnits", value);
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.black }]}>
              Use Metric Units for Height
            </Text>
            <Switch
              value={isHeightMetric}
              onValueChange={(value) => {
                setIsHeightMetric(value);
                updateSetting("heightMetricUnits", value);
              }}
            />
          </View>
        </Card>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
    fontWeight: "bold",
  },
  section: {
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  label: {
    fontSize: 16,
  },
});

export default displaySettings;
