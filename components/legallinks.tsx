import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function LegalLinks() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
          )
        }
      >
        <Text style={{ color: "#3490de" }}>Terms of Use</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://www.gym-pulse.fit")}
      >
        <Text style={{ color: "#3490de" }}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}
