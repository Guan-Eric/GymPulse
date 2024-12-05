import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useThemeMode,
  useTheme,
  CheckBox,
  Card,
  Icon,
  Button,
} from "@rneui/themed";
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
        <Text style={[styles.title, { color: theme.colors.black }]}>
          Settings
        </Text>
        <Card
          containerStyle={[
            styles.card,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
          ]}
        >
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => router.push("/(tabs)/(profile)/profileSettings")}
          >
            <Text style={{ color: theme.colors.black }}>Profile Settings</Text>
            <Icon name="chevron-right" type="material-community" size={20} />
          </Pressable>
        </Card>
        <Card
          containerStyle={[
            styles.card,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
          ]}
        >
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => router.push("/(tabs)/(profile)/displaySettings")}
          >
            <Text style={{ color: theme.colors.black }}>Display Settings</Text>
            <Icon name="chevron-right" type="material-community" size={20} />
          </Pressable>
        </Card>
        <Card
          containerStyle={[
            styles.card,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
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
            <Text style={{ color: theme.colors.black }}>App Settings</Text>
            <Icon name="chevron-right" type="material-community" size={20} />
          </Pressable>
        </Card>

        <Button
          style={{ padding: 20, width: 200, alignSelf: "center" }}
          buttonStyle={{
            borderRadius: 20,
            backgroundColor: theme.colors.error,
          }}
          onPress={() => logOut()}
          title="Log Out"
        />
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
  title: {
    paddingLeft: 20,
    fontFamily: "Lato_700Bold",
    fontSize: 32,
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
