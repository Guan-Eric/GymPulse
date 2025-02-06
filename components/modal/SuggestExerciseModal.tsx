import { Button, Card } from "@rneui/base";
import React from "react";
import { Modal, View, Text, StyleSheet, FlatList } from "react-native";
import { Exercise } from "../types";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  suggestions: Exercise[];
  theme;
}

const SuggestExerciseModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  suggestions,
  theme,
}) => {
  const renderExercise = ({ item }: { item: Exercise }) => (
    <Card
      containerStyle={[
        styles.exerciseCard,
        {
          backgroundColor: theme.colors.grey1,
          borderColor: theme.colors.grey1,
        },
      ]}
    >
      <Text style={[styles.exerciseName, { color: theme.colors.black }]}>
        {item.name}
      </Text>
    </Card>
  );
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
            Suggestions:
          </Text>
          <FlatList
            data={suggestions}
            renderItem={renderExercise}
            keyExtractor={(item) => item.id}
          />
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
    width: "90%",
    height: "70%",
    borderRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
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
    marginVertical: 20,
    borderRadius: 20,
    width: 150,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  exerciseCard: {
    borderRadius: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
});

export default SuggestExerciseModal;
