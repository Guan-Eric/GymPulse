import {
  Switch,
  useTheme,
  Card,
  Button,
  Icon,
  Input,
  ButtonGroup,
} from "@rneui/themed";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardTypeOptions,
} from "react-native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { isUsernameExists } from "../../../backend/user";
import BackButton from "../../../components/BackButton";

function profileDetailUpdate(props) {
  const { theme } = useTheme();
  const { detailType } = useLocalSearchParams();
  const [value, setValue] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const keyboardType =
    detailType == "Height" || detailType == "Weight" ? "numeric" : "default";

  const updateSetting = async (field: string, value: string) => {
    try {
      const userDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );
      if (field == "Username") {
        if (value.length > 3) {
          if (!(await isUsernameExists(value))) {
            setErrorMessage("");
            await updateDoc(userDocRef, { [field.toLowerCase()]: value });
            router.back();
          } else {
            setErrorMessage("Username already exists.");
          }
        } else setErrorMessage("Must be at least 4 characters long.");
      } else {
        await updateDoc(userDocRef, { [field.toLowerCase()]: value });
        router.back();
      }
    } catch (error) {
      console.error(`Error Updating ${field}`, error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <BackButton />
            <Text style={[styles.title, { color: theme.colors.black }]}>
              Update {detailType}
            </Text>
          </View>
          <View>
            <Input
              inputContainerStyle={[
                styles.inputContainer,
                {
                  backgroundColor: theme.colors.grey0,
                  borderColor: theme.colors.grey1,
                },
              ]}
              keyboardType={keyboardType}
              containerStyle={styles.containerStyle}
              value={value}
              onChangeText={(value) => setValue(value)}
              autoCapitalize="none"
              placeholderTextColor="gray"
              inputStyle={[styles.inputText, { color: theme.colors.black }]}
              errorMessage={errorMessage}
            />
          </View>
          <Button
            style={{ padding: 20, width: 200, alignSelf: "center" }}
            buttonStyle={{
              borderRadius: 20,
            }}
            title={"Update"}
            titleStyle={[styles.buttonTitle, { color: theme.colors.black }]}
            onPress={() => updateSetting(detailType as string, value)}
          ></Button>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
    fontWeight: "bold",
  },
  section: {
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Lato_400Regular",
  },
  buttonContainer: {
    width: "100%",
    paddingTop: 16,
  },
  buttonStyle: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: "Lato_400Regular",
  },
  inputContainer: {
    borderRadius: 8,
    marginTop: 20,
    width: 300,
    borderWidth: 1,
  },
  containerStyle: {
    alignSelf: "center",
    alignItems: "center",
  },
  inputText: {
    color: "white",
    fontFamily: "Alata_400Regular",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default profileDetailUpdate;
