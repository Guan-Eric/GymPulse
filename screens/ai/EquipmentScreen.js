import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import { CheckBox } from "@rneui/themed";

function EquipmentScreen({ navigation, route }) {
  const [equipment, setEquipment] = useState([]);

  const handleCheck = (item) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter((eq) => eq !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <Text>Do you have access to equipment?</Text>
        <CheckBox
          checked={equipment.includes("barbells")}
          title="Barbells"
          onPress={() => handleCheck("barbells")}
        />
        <CheckBox
          checked={equipment.includes("dumbbells")}
          title="Dumbbells"
          onPress={() => handleCheck("dumbbells")}
        />
        <CheckBox
          checked={equipment.includes("kettlebells")}
          title="Kettlebells"
          onPress={() => handleCheck("kettlebells")}
        />
        <CheckBox
          checked={equipment.includes("machines")}
          title="Machines"
          onPress={() => handleCheck("machines")}
        />
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate("Health", {
              gender: route.params.gender,
              goal: route.params.goal,
              fitness: route.params.fitness,
              height: route.params.height,
              weight: route.params.weight,
              frequency: route.params.frequency,
              equipment: equipment,
            })
          }
        />
      </SafeAreaView>
    </View>
  );
}

export default EquipmentScreen;
