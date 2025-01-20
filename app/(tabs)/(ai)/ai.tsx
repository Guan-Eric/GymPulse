import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Card, Icon, Button } from "@rneui/themed";
import { Href, router } from "expo-router";
import BackButton from "../../../components/BackButton";

function AIScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            GymPulse AI
          </Text>
        </View>
        {[
          {
            title: "Generate Workout Plan",
            route: "/(tabs)/(ai)/generatePlanScreen",
          },
          {
            title: "Get Exercise Suggestions",
            route: "/(tabs)/(ai)/suggestExerciseScreen",
          },
        ].map((item, index) => (
          <Card
            key={index}
            containerStyle={[
              styles.card,
              {
                backgroundColor: theme.colors.grey0,
                borderColor: theme.colors.grey0,
              },
            ]}
          >
            <Button
              type="clear"
              title={item.title}
              onPress={() => router.push(item.route as Href)}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              titleStyle={[styles.buttonTitle, { color: theme.colors.black }]}
              iconPosition="right"
              icon={
                <Icon
                  name="chevron-right"
                  type="material-community"
                  size={20}
                  color={theme.colors.black}
                />
              }
            />
          </Card>
        ))}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonStyle: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  buttonTitle: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
  },
});

export default AIScreen;
