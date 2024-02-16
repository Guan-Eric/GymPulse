import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { Slider } from "@rneui/themed";

function FrequencyScreen({ navigation, route }) {
  const [frequency, setFrequency] = useState(4);
  return (
    <View>
      <SafeAreaView>
        <Text>How often would you like to workout?</Text>
        <Slider
          value={frequency}
          onValueChange={(value) => setFrequency(value)}
          maximumValue={7}
          minimumValue={1}
          step={1}
          thumbStyle={{
            height: 25,
            width: 25,
            backgroundColor: "#3490de",
          }}
        />
        <Text>{frequency}</Text>
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate("Equipment", {
              gender: route.params.gender,
              goal: route.params.goal,
              fitness: route.params.fitness,
              height: route.params.height,
              weight: route.params.weight,
              frequency: frequency,
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}

export default FrequencyScreen;

const styles = StyleSheet.create({
  pressed: {
    color: "#3490de",
  },
});
