import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeMode, useTheme, CheckBox, Card, Icon } from "@rneui/themed";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { logOut } from "../../../backend/auth";
import { router } from "expo-router";

function SettingScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <Text style={{ color: theme.colors.black }}>Settings</Text>
        <Card
          containerStyle={[
            styles.card,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => router.push("/(tabs)/(profile)/personal")}
          >
            <Text style={{ color: theme.colors.black }}>
              Personal Information
            </Text>
            <Icon name="chevron-right" type="material-community" size={20} />
          </Pressable>
        </Card>
        <Card
          containerStyle={[
            styles.card,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => router.push("/(tabs)/(profile)/display")}
          >
            <Text style={{ color: theme.colors.black }}>Display</Text>
            <Icon name="chevron-right" type="material-community" size={20} />
          </Pressable>
        </Card>
        <Card
          containerStyle={[
            styles.card,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => router.push("/(tabs)/(profile)/notifications")}
          >
            <Text style={{ color: theme.colors.black }}>Notifications</Text>
            <Icon name="chevron-right" type="material-community" size={20} />
          </Pressable>
        </Card>

        <Button onPress={() => logOut()} title="Log Out" />
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 8,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    fontFamily: "Roboto_700Bold",
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
export default SettingScreen;
