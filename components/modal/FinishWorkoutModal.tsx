import { Button } from "@rneui/themed";
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  onSaveWorkout: () => void;
  onDeleteWorkout: () => void;
  theme;
}

const FinishWorkoutModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  onSaveWorkout,
  onDeleteWorkout,
  theme,
}) => {
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
            Finished Your Workout?
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={onSaveWorkout}
              buttonStyle={[
                styles.continueButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Yes
              </Text>
            </Button>
            <Button
              onPress={onClose}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: theme.colors.grey2 },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                No
              </Text>
            </Button>
            <Button
              onPress={onDeleteWorkout}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: theme.colors.error },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Delete Workout
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
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  newStreakButton: {
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

export default FinishWorkoutModal;
