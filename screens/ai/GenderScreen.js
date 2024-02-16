import React, { useState } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
} from "react-native";

function GenderScreen({ navigation }) {
  const [gender, setGender] = useState("");
  return (
    <View>
      <SafeAreaView>
        <Text>What is your gender?</Text>
        <Pressable onPress={() => setGender("female")}>
          <Text style={gender == "female" ? styles.pressed : {}}>Female</Text>
        </Pressable>
        <Pressable onPress={() => setGender("male")}>
          <Text style={gender == "male" ? styles.pressed : {}}>Male</Text>
        </Pressable>
        <Pressable onPress={() => setGender("other")}>
          <Text style={gender == "other" ? styles.pressed : {}}>Other</Text>
        </Pressable>
        <Button
          title="Continue"
          onPress={() => navigation.navigate("Goals", { gender: gender })}
        />
      </SafeAreaView>
    </View>
  );
}

export default GenderScreen;

const styles = StyleSheet.create({
  pressed: {
    color: "#3490de",
  },
});
