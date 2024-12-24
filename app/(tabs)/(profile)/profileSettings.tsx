import { Switch, useTheme, Card, Button, Icon } from "@rneui/themed";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import BackButton from "../../../components/BackButton";
import DeleteAccountModal from "../../../components/modal/DeleteAccountModal";
import { deleteAccount } from "../../../backend/user";

function profileSettings(props) {
  const { theme } = useTheme();
  const [showStreak, setShowStreak] = useState<boolean | undefined>();
  const [showWorkout, setShowWorkout] = useState<boolean | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfileSettings = async () => {
      const userDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );
      const userDoc = await getDoc(userDocRef);
      const data = userDoc.data();
      setShowStreak(data?.showStreak);
      setShowWorkout(data?.showWorkout);
    };

    fetchProfileSettings();
  }, []);

  const updateSetting = async (field: string, value: boolean) => {
    const userDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser.uid}`
    );
    await updateDoc(userDocRef, { [field]: value });
  };

  const handleDeleteAccount = async () => {
    setIsModalVisible(false);
    router.push("/(auth)/welcome");
    await deleteAccount();
    await FIREBASE_AUTH.currentUser.delete();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Profile Settings
          </Text>
        </View>
        <Card
          containerStyle={[
            styles.section,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
            Profile Details
          </Text>
          {[
            { title: "Name" },
            { title: "Username" },
            { title: "Weight" },
            { title: "Height" },
          ].map((item, index) => (
            <Button
              key={index}
              title={item.title}
              type="clear"
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              titleStyle={[styles.buttonTitle, { color: theme.colors.black }]}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(profile)/profileDetailUpdate",
                  params: { detailType: item.title },
                })
              }
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
          ))}
        </Card>

        <Card
          containerStyle={[
            styles.section,
            {
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.grey0,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
            Profile Preferences
          </Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.black }]}>
              Display Streak on Profile
            </Text>
            <Switch
              value={showStreak}
              onValueChange={(value) => {
                setShowStreak(value);
                updateSetting("showStreak", value);
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.black }]}>
              Include Workout Plan in Posts
            </Text>
            <Switch
              value={showWorkout}
              onValueChange={(value) => {
                setShowWorkout(value);
                updateSetting("showWorkout", value);
              }}
            />
          </View>
        </Card>
        <Button
          buttonStyle={styles.deleteButtonStyle}
          title="Delete Account"
          onPress={() => setIsModalVisible(true)}
          color={theme.colors.error}
        />
        <DeleteAccountModal
          modalVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onDeleteAccount={() => handleDeleteAccount()}
          onCancel={() => setIsModalVisible(false)}
          theme={theme}
        />
      </SafeAreaView>
    </View>
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
  deleteButtonStyle: {
    width: 300,
    borderRadius: 20,
    margin: 20,
    padding: 10,
    alignSelf: "center",
  },
  buttonTitle: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Lato_400Regular",
  },
});

export default profileSettings;
