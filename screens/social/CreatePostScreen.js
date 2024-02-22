import React from "react";
import { useState } from "react";
import {
  FIRESTORE_DB,
  FIREBASE_AUTH,
  FIREBASE_STR,
} from "../../firebaseConfig";
import { View, TextInput, Button, Image } from "react-native";
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

function CreatePostScreen({ route, navigation }) {
  const [caption, setCaption] = useState("");

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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Post" onPress={createPost} />
      <Image
        source={{ uri: route.params.image }}
        style={{ width: ScreenWidth, height: ScreenWidth * 1.25 }}
      />
      <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={(text) => setCaption(text)}
        value={caption}
        style={{ padding: 10 }}
        placeholder="Write caption here"
      />
    </View>
  );
}

export default CreatePostScreen;
