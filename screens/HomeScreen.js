import React from "react";
import { Text, View, StyleSheet } from "react-native";

function HomeScreen(props) {
  return (
    <View style={styles.container}>
      <Text>hi</Text>
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
export default HomeScreen;
