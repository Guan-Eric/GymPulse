import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Tooltip, Button, useTheme } from "@rneui/themed";

interface StreakTooltipProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakTooltip: React.FC<StreakTooltipProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const [openToolTip, setOpenToolTip] = useState(false);
  const { theme } = useTheme();

  return (
    <Tooltip
      visible={openToolTip}
      onOpen={() => setOpenToolTip(true)}
      onClose={() => setOpenToolTip(false)}
      popover={
        <View>
          <Text style={[styles.tooltipText, { color: theme.colors.grey0 }]}>
            Current Streak: {currentStreak}
          </Text>
          <Text style={[styles.tooltipText, { color: theme.colors.grey0 }]}>
            Longest Streak: {longestStreak}
          </Text>
        </View>
      }
    >
      <Button type="clear" onPress={() => setOpenToolTip(true)}>
        <Image source={require("../assets/fire.png")} style={styles.icon} />
      </Button>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  tooltipText: {
    fontSize: 14,
    marginBottom: 4,
  },
  icon: {
    width: 32,
    height: 32,
  },
});

export default StreakTooltip;
