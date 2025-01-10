import { Button } from "@rneui/base";
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  minLength: number;
}

const PasswordErrorModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  minLength,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: "#1f1f1f" }]}>
          <Text style={[styles.modalText, { color: "#f8f9fa" }]}>
            Password must:
          </Text>
          <Text style={[styles.modalSubText, { color: "#f8f9fa" }]}>
            {"\n"}- Be at least {minLength} characters long.
            {"\n"}- Contain at least one uppercase letter.
            {"\n"}- Contain at least one lowercase letter.
            {"\n"}- Contain at least one number.
            {"\n"}- Contain at least one special character.
            {"\n"}- Match the confirmation password.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={onClose}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: "#3490de" },
              ]}
            >
              <Text style={[styles.buttonText, { color: "#f8f9fa" }]}>Ok</Text>
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

    textAlign: "left",
  },
  modalSubText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
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

export default PasswordErrorModal;
