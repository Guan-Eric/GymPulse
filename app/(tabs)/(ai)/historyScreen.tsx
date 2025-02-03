import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from "react-native";
import { GeneratedPlan } from "../../../components/types";
import { Button, Card, Icon, useTheme } from "@rneui/themed";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { router, useFocusEffect } from "expo-router";
import { format } from "date-fns";
import BackButton from "../../../components/BackButton";

export default function HistoryScreen() {
  const [plans, setPlans] = useState<GeneratedPlan[]>([]);
  const { theme } = useTheme();

  const fetchPlans = async () => {
    const plansRef = collection(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser?.uid}/GeneratedPlans`
    );
    const q = query(plansRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const plansList: GeneratedPlan[] = [];
    querySnapshot.forEach((doc) => {
      plansList.push({
        id: doc.id,
        name: doc.data().name,
        exercises: doc.data().exercises,
        date: doc.data().date.toDate(),
        saved: doc.data().saved,
      });
    });
    setPlans(plansList);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );
  const renderPlan = ({ item }: { item: GeneratedPlan }) => (
    <Card
      containerStyle={[
        styles.planCard,
        {
          backgroundColor: theme.colors.grey0,
          borderColor: theme.colors.grey0,
        },
      ]}
    >
      <Button
        type="clear"
        title={
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <Text style={[styles.buttonTitle, { color: theme.colors.black }]}>
              {item.name}
            </Text>
            <Text style={[styles.dateText, { color: theme.colors.grey4 }]}>
              {format(item?.date, "MMMM do, yyyy 'at' h:mm a")}
            </Text>
          </View>
        }
        onPress={() =>
          router.push({
            pathname: `/(tabs)/(ai)/generatedPlanScreen`,
            params: { generatePlanId: item.id },
          })
        }
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonStyle}
        iconPosition="right"
        icon={
          <Icon
            name="chevron-right"
            type="material-community"
            size={20}
            color={theme.colors.black}
          />
        }
      />
    </Card>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Workout History
          </Text>
        </View>
        <FlatList
          data={plans}
          renderItem={renderPlan}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  listContainer: {
    gap: 15,
  },
  planCard: {
    padding: 15,
    borderRadius: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  exercise: {
    marginTop: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonStyle: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  buttonTitle: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Lato_400Regular",
  },
});
