import { Button } from "@rneui/themed";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Image } from "react-native";

interface StreakModalProps {
  currentStreak: number;
  longestStreak: number;
  theme: any;
}

const StreakResetModal: React.FC<StreakModalProps> = ({
  currentStreak,
  longestStreak,
  theme,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.grey0 },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.modalText, { color: theme.colors.black }]}>
                {currentStreak}
              </Text>
              <Image
                source={require("../../assets/fire.png")}
                style={{ width: 100, height: 100 }}
              />
            </View>
            <Text style={[styles.modalSubText, { color: theme.colors.black }]}>
              Longest Streak: {longestStreak}
            </Text>
            <Button
              onPress={() => setIsModalOpen(false)}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                Ok
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      <Button type="clear" onPress={() => setIsModalOpen(true)}>
        <Image source={require("../../assets/fire.png")} style={styles.icon} />
      </Button>
    </>
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
    fontSize: 100,
    fontFamily: "Lato_700Bold",
  },
  modalSubText: {
    fontSize: 14,
    marginVertical: 10,
    fontFamily: "Lato_700Bold",
    textAlign: "center",
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
  icon: {
    width: 32,
    height: 32,
  },
});

export default StreakResetModal;
