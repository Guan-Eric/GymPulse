import React, { useEffect, useState } from "react";
import { Text, View, Pressable, Appearance, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { FIRESTORE_DB } from "../../../firebaseConfig";
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
import { Plan } from "../../../components/types";
import { router } from "expo-router";
import { useTheme, Button, Icon } from "@rneui/themed";
import { getPlans } from "../../../backend/plan";

function PlanScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setPlans(await getPlans());
    };
    fetchData();
  }, []);
  

  const handleCreatePlan = async () => {
    try {
      const docRef = await addDoc(
        collection(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}/Plans`),
        {
          name: "New Plan",
          userId: FIREBASE_AUTH.currentUser.uid,
        }
      );
      const planDoc = doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}/Plans/${docRef.id}`);
      await updateDoc(planDoc, { id: docRef.id });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            alignContent: "space-between",
          }}
        >
          <Text style={[styles.titleText, { color: theme.colors.black }]}>
            Your Plans
          </Text>
          <Button type="clear" onPress={handleCreatePlan}>
            <Icon
              color={theme.colors.primary}
              name="plus"
              type="material-community"
            />
          </Button>
        </View>
        <ScrollView>
          {plans.length == 0 ? (
            <Text>No plans available. Create a new plan!</Text>
          ) : (
            plans.map((item) => (
              <Pressable
                key={item.name}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(workout)/plan",
                    params: {
                      planId: item.id,
                    },
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "space-between",
                  }}
                >
                  <Text
                    style={[styles.baseText, { color: theme.colors.black }]}
                  >
                    {item.name}
                  </Text>
                  <Button type="clear">
                    <Icon name="minus" type="material-community" />
                  </Button>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
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
    paddingLeft: 10,
    fontFamily: "Lato_400Regular",
    fontSize: 20,
  },
  titleText: {
    fontFamily: "Lato_700Bold",
    fontSize: 24,
    paddingLeft: 10,
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
export default PlanScreen;
