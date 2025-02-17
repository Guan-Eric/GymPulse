import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Card, Icon, Button } from "@rneui/themed";
import { Href, router } from "expo-router";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import SubscriptionModal from "../../../components/modal/SubscriptionModal";
import Constants from "expo-constants";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

function AIScreen() {
  const { theme } = useTheme();
  const [offerings, setOfferings] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstTitle, setFirstTitle] = useState("");

  const initializeRC = async () => {
    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenueCatApiKey,
        appUserID: FIREBASE_AUTH.currentUser?.uid,
      });
    } else {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenueCatApiKey, // TODO: change to android variable
        appUserID: FIREBASE_AUTH.currentUser?.uid,
      });
    }
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    await fetchOfferings();
  };
  const checkSubscription = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("customerInfo", customerInfo);
    setHasSubscription(customerInfo.entitlements.active["Pro"] !== undefined);
  };
  const fetchOfferings = async () => {
    try {
      setFirstTitle((await Purchases.canMakePayments())?.toString());
      const offerings = await Purchases.getOfferings();
      const currentOfferings = offerings.current;
      console.log("hi", currentOfferings);
      if (currentOfferings) setOfferings(currentOfferings.availablePackages);
    } catch (error) {
      console.error("Error fetching offerings:", error);
    }
  };

  useEffect(() => {
    initializeRC();
    checkSubscription();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.title, { color: theme.colors.black }]}>
            GymPulse AI
          </Text>
        </View>
        {[
          {
            title: "Get a Personalized Workout Plan",
            route: "/(tabs)/(ai)/generatePlanScreen",
            requiresSubscription: true,
          },
          {
            title: "Get Exercise Suggestions",
            route: "/(tabs)/(ai)/suggestExerciseScreen",
            requiresSubscription: true,
          },
          {
            title: "View Generated Plans",
            route: "/(tabs)/(ai)/historyScreen",
          },
        ].map((item, index) => (
          <Card
            key={index}
            containerStyle={[
              styles.card,
              {
                backgroundColor: theme.colors.grey0,
                borderColor: theme.colors.grey0,
                opacity:
                  item.requiresSubscription && !hasSubscription ? 0.5 : 1,
              },
            ]}
          >
            <Button
              type="clear"
              title={item.title}
              onPress={
                item.requiresSubscription && !hasSubscription
                  ? () => setIsModalOpen(true)
                  : () => router.push(item.route as Href)
              }
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              titleStyle={[styles.buttonTitle, { color: theme.colors.black }]}
              iconPosition="right"
              icon={
                item.requiresSubscription && !hasSubscription ? (
                  <Icon name={"lock"} size={20} color={theme.colors.black} />
                ) : (
                  <Icon
                    name="chevron-right"
                    type="material-community"
                    size={20}
                    color={theme.colors.black}
                  />
                )
              }
            />
          </Card>
        ))}
        <SubscriptionModal
          options={offerings}
          setHasSubscription={setHasSubscription}
          theme={theme}
          isModalVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
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
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
    paddingLeft: 20,
  },
});

export default AIScreen;
