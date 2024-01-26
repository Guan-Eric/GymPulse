import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Button,
  Appearance,
  ScrollView,
} from "react-native";
import { theme } from "../styles/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { FIRESTORE_DB } from "../firebaseConfig";
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

function PlanScreen({ navigation }) {
  const [styles, setSetyles] = useState(
    Appearance.getColorScheme() == "light" ? theme.lightMode : theme.darkMode
  );
  const [plans, setPlans] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchPlansFromFirestore = async () => {
      try {
        setUserId(FIREBASE_AUTH.currentUser.uid);
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            name: "",
            email: FIREBASE_AUTH.currentUser.email,
            darkMode: "light",
            metricUnits: false,
          });
        }
        const plansCollectionRef = collection(userDocRef, "Plans");

        const unsubscribe = onSnapshot(plansCollectionRef, (snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setPlans(data);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching plans from Firestore:", error);
      }
    };

    fetchPlansFromFirestore();
  }, []);

  const handleCreatePlan = async () => {
    try {
      const docRef = await addDoc(
        collection(FIRESTORE_DB, `Users/${userId}/Plans`),
        {
          name: "New Plan",
          userId: userId,
        }
      );
      const planDoc = doc(FIRESTORE_DB, `Users/${userId}/Plans/${docRef.id}`);
      await updateDoc(planDoc, { id: docRef.id });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text>Your Plan</Text>
        <Button title="Create Plan" onPress={handleCreatePlan} />
        <ScrollView>
          {plans.length == 0 ? (
            <Text>No plans available. Create a new plan!</Text>
          ) : (
            plans.map((item) => (
              <Pressable
                key={item.name}
                onPress={() =>
                  navigation.navigate("ViewPlan", {
                    planId: item.id,
                    userId: userId,
                  })
                }
              >
                <Text style={styles.titleText}>{item.name}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default PlanScreen;
