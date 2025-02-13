import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Card, Icon, Button } from "@rneui/themed";
import { Href, router, useFocusEffect } from "expo-router";
import BackButton from "../../../components/BackButton";
import Purchases from "react-native-purchases";
import SubscriptionModal from "../../../components/modal/SubscriptionModal";

function AIScreen() {
  const { theme } = useTheme();
  const [offerings, setOfferings] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstTitle, setFirstTitle] = useState("");

  const checkSubscription = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("customerInfo", customerInfo);
    setHasSubscription(
      customerInfo.entitlements.active["ai_features"] !== undefined
    );
  };
  const fetchOfferings = async () => {
    try {
      setFirstTitle(await Purchases.canMakePayments()?.toString());
      const offerings = await Purchases.getOfferings();

      console.log("Offerings Response:", offerings);

      if (
        !offerings ||
        !offerings.all ||
        Object.keys(offerings.all).length === 0
      ) {
        console.warn("No offerings found");
        return;
      }

      console.log("offerings2");
      setOfferings(offerings);
    } catch (error) {
      console.error("Error fetching offerings:", error);
    }
  };

  useEffect(() => {
    checkSubscription();
    fetchOfferings();
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
            title: firstTitle, //"Get a Personalized Workout Plan",
            route: "/(tabs)/(ai)/generatePlanScreen",
            requiresSubscription: true,
          },
          {
            title: offerings?.toString(), //"Get Exercise Suggestions",
            route: "/(tabs)/(ai)/suggestExerciseScreen",
            requiresSubscription: true,
          },
          {
            title: offerings, //"View Generated Plans",
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
  },
});

export default AIScreen;
