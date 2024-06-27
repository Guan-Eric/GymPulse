import { Text } from "@rneui/themed";
import { StyleSheet } from "react-native";

function BodyPartCard({ bodypart }) {
  return <Text style={styles.baseText}>{bodypart}</Text>;
}

const styles = StyleSheet.create({
  baseText: {
    fontSize: 16,
  },
});

export default BodyPartCard;
