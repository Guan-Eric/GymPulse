import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Button, Icon, PricingCard } from "@rneui/themed";
import Purchases from "react-native-purchases";
import { purchaseSubscription } from "../../backend/ai";
import { ScrollView } from "react-native-gesture-handler";
import LegalLinks from "../legallinks";

interface SubscriptionModalProps {
  options;
  setHasSubscription;
  isModalVisible;
  theme;
  onClose;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  options,
  setHasSubscription,
  isModalVisible,
  theme,
  onClose,
}) => {
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.grey0 },
            ]}
          >
            <ScrollView>
              <Text style={[styles.title, { color: theme.colors.black }]}>
                Select Your Plan
              </Text>
              {options?.map((option, index) => (
                <PricingCard
                  key={index}
                  color={theme.colors.primary}
                  title={option?.product.title}
                  price={
                    option?.product.currencyCode +
                    "$ " +
                    option?.product.price +
                    " per " +
                    (option?.product.billingPeriod === "YEAR"
                      ? "year"
                      : "month")
                  }
                  info={["Subscription for AI Features"]}
                  button={{
                    titleStyle: { fontFamily: "Lato_400Regular" },
                    buttonStyle: {
                      borderRadius: 20,
                      height: 40,
                      width: 150,
                      alignSelf: "center",
                    },
                    title: "Subscribe",
                    onPress: async () => {
                      if (await purchaseSubscription(option)) {
                        setHasSubscription(true);
                        onClose();
                      }
                    },
                  }}
                  containerStyle={[
                    styles.pricingCard,
                    {
                      backgroundColor: theme.colors.grey1,
                      borderColor: theme.colors.grey1,
                    },
                  ]}
                  pricingStyle={{
                    color: theme.colors.black,
                    fontFamily: "Lato_700Bold",
                    fontSize: 24,
                  }}
                  titleStyle={{ fontFamily: "Lato_700Bold", fontSize: 28 }}
                  infoStyle={{
                    color: theme.colors.grey4,
                    fontFamily: "Lato_700Bold",
                  }}
                />
              ))}
              <Button
                onPress={onClose}
                type="clear"
                titleStyle={{
                  color: theme.colors.grey4,
                  fontFamily: "Lato_400Regular",
                  fontSize: 16,
                }}
              >
                Stick with the Free Plan
              </Button>
              <LegalLinks />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    height: "75%",
  },
  pricingCard: {
    alignSelf: "center",
    width: 300,
    marginVertical: 10,
    borderRadius: 14,
  },
});

export default SubscriptionModal;
