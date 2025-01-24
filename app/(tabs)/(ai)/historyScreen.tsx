import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { GeneratedPlan } from "../../../components/types";
import { Card, useTheme } from "@rneui/themed";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

export default function HistoryScreen() {
  const [plans, setPlans] = useState<GeneratedPlan[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPlans = async () => {
      const plansRef = collection(FIRESTORE_DB, "Plans");
      const q = query(plansRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const plansList: GeneratedPlan[] = [];
      querySnapshot.forEach((doc) => {
        plansList.push(doc.data() as GeneratedPlan);
      });
      setPlans(plansList);
    };

    fetchPlans();
  }, []);

  const renderPlan = ({ item }: { item: GeneratedPlan }) => (
    <Card
      containerStyle={[
        styles.planCard,
        { backgroundColor: theme.colors.grey5 },
      ]}
    >
      <Card.Title style={{ color: theme.colors.black }}>{item.name}</Card.Title>
      <Card.Divider />
      <Text style={{ color: theme.colors.black, marginBottom: 10 }}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      {item.exercises.map((exercise, index) => (
        <View key={index} style={styles.exercise}>
          <Text style={{ color: theme.colors.black, fontWeight: "500" }}>
            {exercise.name}
          </Text>
          <Text style={{ color: theme.colors.black }}>
            Sets: {exercise.sets} x Reps: {exercise.reps}
          </Text>
        </View>
      ))}
    </Card>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.black }]}>
          Workout History
        </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    gap: 15,
  },
  planCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
});
