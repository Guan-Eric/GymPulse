import React from "react";
import { useState } from "react";
import {
  FIRESTORE_DB,
  FIREBASE_AUTH,
  FIREBASE_STR,
} from "../../firebaseConfig";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { ScreenWidth } from "@rneui/base";
import { Input, useTheme, Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

function CreatePostScreen({ route, navigation }) {
  const [caption, setCaption] = useState("");
  const { theme } = useTheme();
  const createPost = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dateDay = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${dateDay} ${hours}:${minutes}`;
    try {
      const postDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );

      const userPostsCollection = collection(postDocRef, "Posts");
      const userPostsDocRef = await addDoc(userPostsCollection, {
        caption: caption,
        date: formattedDateTime,
        userId: FIREBASE_AUTH.currentUser.uid,
      });
      const response = await fetch(route.params.image);
      const blob = await response.blob();

      const imageRef = ref(FIREBASE_STR, `posts/${userPostsDocRef.id}`);
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);

      const userPostsDoc = doc(userPostsCollection, userPostsDocRef.id);
      await updateDoc(userPostsDoc, {
        id: userPostsDocRef.id,
        url: downloadUrl,
      });
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
          }}
        >
          <ScrollView>
            <Image
              source={{ uri: route.params.image }}
              style={{
                alignSelf: "center",
                borderRadius: 20,
                width: 0.9 * ScreenWidth,
                height: 0.9 * ScreenWidth * 1.25,
                resizeMode: "cover",
              }}
            />
            <View
              style={{
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="outline"
                buttonStyle={styles.cancelButton}
                title="Cancel"
                onPress={() => navigation.goBack()}
              />
              <Button
                buttonStyle={styles.postButton}
                title="Post"
                onPress={createPost}
              />
            </View>
            <View style={{ paddingTop: 10, paddingLeft: 15, paddingRight: 15 }}>
              <Input
                inputContainerStyle={styles.caption}
                multiline
                maxLength={200}
                onChangeText={(text) => setCaption(text)}
                placeholder="Write caption here"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  postButton: {
    borderRadius: 10,
  },
  cancelButton: {
    borderRadius: 10,
  },
  caption: { borderColor: "transparent" },
});

export default CreatePostScreen;
