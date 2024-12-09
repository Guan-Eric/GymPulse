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
import BottomSheetMenu from "../../../components/BottomSheetView";

function ViewPlanScreen() {
  const [plan, setPlan] = useState<Plan>();
  const [isWeightMetric, setIsWeightMetric] = useState(true);
  const { planId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

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
        setBottomSheetVisible(false);
        handleAddDay();
      },
      containerStyle: { backgroundColor: theme.colors.grey0 },
    },
    {
      title: "Delete Plan",
      onPress: () => {
        setBottomSheetVisible(false);
        handleDeletePlan();
      },
      containerStyle: { backgroundColor: theme.colors.error },
      titleStyle: { color: theme.colors.black },
    },
    {
      title: "Cancel",
      onPress: () => setBottomSheetVisible(false),
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      behavior="padding"
    >
      {loading ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Instagram />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              <BottomSheetMenu options={bottomSheetOptions} theme={theme} />
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
                  />
                ))
              : null}
            <Button
              type="clear"
              icon={
                <Icon
                  name="plus-circle"
                  size={24}
                  color={theme.colors.black}
                  type="material-community"
                />
              }
              onPress={handleAddDay}
            />
            <Button
              type="clear"
              title="Delete Plan"
              onPress={handleDeletePlan}
              color={theme.colors.error}
            />
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
    marginBottom: -20,
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
    borderColor: "gray",
  },
});

export default ViewPlanScreen;
