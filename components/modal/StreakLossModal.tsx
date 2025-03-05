import { Button } from "@rneui/themed";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Platform } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  onContinueStreak: () => void;
  onNewStreak: () => void;
  theme;
}

const StreakResetModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  onContinueStreak,
  onNewStreak,
  theme,
}) => {
  const [loading, setLoading] = useState(false);
  const adUnitId =
    Platform.OS === "ios"
      ? Constants.expoConfig?.extra?.admobIOSStreakUnitId
      : Constants.expoConfig?.extra?.admobAndroidStreakUnitId;

  const ad = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  async function handleShowAd() {
    setLoading(true);
    try {
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        ad.show();
      });

      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        setLoading(false);
        onContinueStreak();
      });

      ad.load();
    } catch (error) {
      console.error("Error showing reward ad", error);
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.colors.grey0 }]}
        >
          <Text style={[styles.modalText, { color: theme.colors.black }]}>
            Oh no! Your streak has ended!
          </Text>
          <Text style={[styles.modalSubText, { color: theme.colors.black }]}>
            Watch an ad to continue your streak or start a new one.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => handleShowAd()}
              loading={loading}
              disabled={loading}
              buttonStyle={[
                styles.continueButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Watch an ad
              </Text>
            </Button>
            <Button
              onPress={onNewStreak}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: theme.colors.grey2 },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Lose your current streak
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    width: 300,
    padding: 20,

    borderRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalSubText: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  newStreakButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
});

export default StreakResetModal;
