import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  onContinueStreak: () => void;
  onNewStreak: () => void;
}

const StreakModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  onContinueStreak,
  onNewStreak,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Your streak has ended!</Text>
          <Text style={styles.modalSubText}>
            Pay $1 to continue your streak or start a new one.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onContinueStreak}
              style={styles.continueButton}
            >
              <Text style={styles.buttonText}>Pay $1 to Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNewStreak}
              style={styles.newStreakButton}
            >
              <Text style={styles.buttonText}>Start a New Streak</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
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
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  newStreakButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default StreakModal;
