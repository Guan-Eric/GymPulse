import React from "react";
import { Text, View, StyleSheet } from "react-native";

function AIScreen(props) {
  return (
    <View style={styles.container}>
      <Text>AIScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AIScreen;
