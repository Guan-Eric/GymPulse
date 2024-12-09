import React, { useState } from "react";
import { Button, Icon, ListItem } from "@rneui/themed";
import { BottomSheet } from "@rneui/themed";
import { View } from "react-native";

interface BottomSheetOption {
  title: string;
  containerStyle?: object;
  titleStyle?: object;
  onPress: () => void;
}

interface BottomSheetMenuProps {
  options: BottomSheetOption[];
  theme;
}

const BottomSheetMenu: React.FC<BottomSheetMenuProps> = ({
  options,
  theme,
}) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
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
        onPress={toggleBottomSheet}
      />
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onBackdropPress={toggleBottomSheet}
      >
        {options.map((option, index) => (
          <ListItem
            key={index}
            containerStyle={option.containerStyle}
            onPress={option.onPress}
            onPressOut={() => setIsBottomSheetVisible(false)}
          >
            <ListItem.Content>
              <ListItem.Title style={option.titleStyle}>
                {option.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
};

export default BottomSheetMenu;
