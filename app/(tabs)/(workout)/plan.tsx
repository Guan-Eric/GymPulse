import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plan } from "../../../components/types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Input, useTheme, Button, Card, Icon } from "@rneui/themed";
import { addDay, deletePlan, getPlan, savePlan } from "../../../backend/plan";
import DayCard from "../../../components/DayCard";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { Instagram } from "react-content-loader/native";
import { getUser } from "../../../backend/user";
import ThreeDotsModal from "../../../components/modal/ThreeDotsModal";
import BackButton from "../../../components/BackButton";
import PlanLoader from "../../../components/loader/PlanLoader";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isWeightMetric, setIsWeightMetric] = useState(true);
  const { planId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchPlanFromFirestore = async () => {
    try {
      setPlan(await getPlan(planId as string));
      setIsWeightMetric(
        (await getUser(FIREBASE_AUTH.currentUser.uid)).weightMetricUnits
      );
    } catch (error) {
      console.error("Error fetching plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (plan) {
      savePlan(plan);
    }
  }, [plan]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanFromFirestore();
    }, [])
  );

  useEffect(() => {
    fetchPlanFromFirestore();
  }, []);

  const handleSaveName = (name: string) => {
    setPlan({ ...plan, name });
  };

  const handleAddDay = async () => {
    setPlan(await addDay(plan));
  };

  const handleDeletePlan = async () => {
    deletePlan(plan);
    router.back();
  };

  const bottomSheetOptions = [
    {
      title: "Add Day",
      onPress: () => {
        handleAddDay();
      },
      containerStyle: { backgroundColor: theme.colors.primary },
    },
    {
      title: "Delete Plan",
      onPress: () => {
        handleDeletePlan();
      },
      containerStyle: { backgroundColor: theme.colors.error },
    },
    {
      title: "Cancel",
      onPress: () => {
        null;
      },
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        marginBottom: Platform.OS == "ios" ? -35 : 0,
      }}
      behavior="padding"
    >
      {loading ? (
        <SafeAreaView style={{ flex: 1 }}>
          <PlanLoader theme={theme} />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <BackButton />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: -20,
                justifyContent: "space-between",
                paddingRight: 20,
              }}
            >
              <Input
                label={"Plan Name"}
                containerStyle={styles.nameInput}
                inputContainerStyle={[
                  styles.inputRoundedContainer,
                  { borderColor: theme.colors.greyOutline },
                ]}
                onChangeText={handleSaveName}
                value={plan?.name}
              />
              <ThreeDotsModal options={bottomSheetOptions} theme={theme} />
            </View>
            {plan?.days.length > 0
              ? plan?.days?.map((day, dayIndex) => (
                  <DayCard
                    key={day.id}
                    plan={plan}
                    day={day}
                    dayIndex={dayIndex}
                    theme={theme}
                    isWeightMetric={isWeightMetric}
                    setPlan={setPlan}
                    isWorkout={false}
                    isDisabled={false}
                    workoutTime={null}
                  />
                ))
              : null}
          </ScrollView>
        </SafeAreaView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  nameInput: {
    width: "85%",
    paddingLeft: 15,
  },
  inputContainer: {
    width: 70,
    height: 40,
  },
  inputRoundedContainer: {
    marginTop: 6,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default ViewPlanScreen;
