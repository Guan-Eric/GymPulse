import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
  return (
    <Modal
      animationType="slide"
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
            <TouchableOpacity
              onPress={onContinueStreak}
              style={[
                styles.continueButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Watch an ad
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNewStreak}
              style={[
                styles.newStreakButton,
                { backgroundColor: theme.colors.grey2 },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Lose your current streak
              </Text>
            </TouchableOpacity>
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
