import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

function WeightScreen({ navigation, route }) {
  const [weight, setWeight] = useState(35);

  return (
    <View>
      <SafeAreaView>
        <Text>What is your weight?</Text>
        <Picker
          selectedValue={weight}
          onValueChange={(value) => setWeight(value)}
          style={{ height: 50, width: 150 }}
        >
          {[...Array(180 - 35 + 1).keys()].map((weight) => (
            <Picker.Item
              key={weight}
              label={`${weight + 35}`}
              value={weight + 35}
            />
          ))}
        </Picker>
        <Text>kg</Text>
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate("Frequency", {
              gender: route.params.gender,
              goal: route.params.goal,
              fitness: route.params.fitness,
              height: route.params.height,
              weight: weight,
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}

export default WeightScreen;
