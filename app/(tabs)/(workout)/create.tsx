import React, { useState } from "react";
import {
  FIREBASE_AUTH,
  FIRESTORE_DB,
  FIREBASE_STR,
} from "../../../firebaseConfig";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { ScreenWidth } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import { Input, useTheme, Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { addNotification } from "../../../backend/user";

function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const { workoutId } = useLocalSearchParams();

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

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
        title: title,
        caption: caption,
        date: formattedDateTime,
        userId: FIREBASE_AUTH.currentUser.uid,
        workoutId: workoutId,
      });

      const downloadUrls = [];

      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        const imageRef = ref(FIREBASE_STR, `posts/${userPostsDocRef.id}/${i}`);
        await uploadBytes(imageRef, blob);
        const downloadUrl = await getDownloadURL(imageRef);
        downloadUrls.push(downloadUrl);
      }

      const userPostsDoc = doc(userPostsCollection, userPostsDocRef.id);
      await updateDoc(userPostsDoc, {
        id: userPostsDocRef.id,
        urls: downloadUrls,
      });

      addNotification(
        FIREBASE_AUTH.currentUser.uid,
        "post",
        userPostsDocRef.id
      );
      router.push("/(tabs)/(workout)/plans");
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
          <Input
            inputContainerStyle={styles.caption}
            maxLength={50}
            onChangeText={(text) => setTitle(text)}
            placeholder="Write Title here"
          />
          <ScrollView>
            {images.length > 0 ? (
              images.map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={{
                    alignSelf: "center",
                    borderRadius: 20,
                    width: 0.9 * ScreenWidth,
                    height: 0.9 * ScreenWidth * 1.25,
                    resizeMode: "cover",
                    marginBottom: 10,
                  }}
                />
              ))
            ) : (
              <Pressable onPress={pickImages}>
                <Text>Add Photos</Text>
              </Pressable>
            )}
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
                onPress={() => router.back()}
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
