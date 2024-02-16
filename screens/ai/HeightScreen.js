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

function HeightScreen({ navigation, route }) {
  const [height, setHeight] = useState(120);

  return (
    <View>
      <SafeAreaView>
        <Text>What is your height?</Text>
        <Picker
          selectedValue={height}
          onValueChange={(value) => setHeight(value)}
          style={{ height: 50, width: 150 }}
        >
          {[...Array(215 - 120 + 1).keys()].map((height) => (
            <Picker.Item
              key={height}
              label={`${height + 120}`}
              value={height + 120}
            />
          ))}
        </Picker>
        <Text>cm</Text>
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate("Weight", {
              gender: route.params.gender,
              goal: route.params.goal,
              fitness: route.params.fitness,
              height: height,
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}

export default HeightScreen;
