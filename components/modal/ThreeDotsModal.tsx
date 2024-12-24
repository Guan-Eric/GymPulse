import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Button, Icon } from "@rneui/themed";

interface BottomSheetOption {
  title: string;
  containerStyle?: object;
  titleStyle?: object;
  onPress: () => void;
}

interface BottomSheetMenuProps {
  options: BottomSheetOption[];
  theme: any;
}

const ThreeDotsModal: React.FC<BottomSheetMenuProps> = ({ options, theme }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View>
      <Button
        type="clear"
        icon={
          <Icon
            name="dots-vertical"
            size={24}
            color={theme.colors.black}
            type="material-community"
          />
        }
        onPress={toggleModal}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleModal}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.grey0 },
            ]}
          >
            {options.map((option, index) => (
              <Button
                key={index}
                buttonStyle={[styles.option, option.containerStyle]}
                onPress={() => {
                  option.onPress();
                  toggleModal();
                }}
                title={option.title}
                titleStyle={styles.optionText}
              ></Button>
            ))}
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
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 300,
    padding: 20,
  },
  option: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
});

export default ThreeDotsModal;
