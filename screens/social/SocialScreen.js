import React, { useEffect } from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SocialScreen({ navigation }) {
  useEffect(() => {
    const fetchFeedFromFirestore = async () => {
      try {
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            name: "",
            email: FIREBASE_AUTH.currentUser.email,
            darkMode: true,
            metricUnits: false,
          });
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
  });
  return (
    <View>
      <SafeAreaView>
        <Button title="Camera" onPress={() => navigation.navigate("Camera")} />
      </SafeAreaView>
    </View>
  );
}

export default SocialScreen;
