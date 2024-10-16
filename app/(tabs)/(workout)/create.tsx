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
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadString,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { ScreenWidth } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import { Input, useTheme, Button, Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { addNotification } from "../../../backend/user";
import ImageCarousel from "../../../components/PostCarousel";
import { fetchLastUserPostDate } from "../../../backend/post";

function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const { theme } = useTheme();
  const [blobs, setBlobs] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { workoutId, planName, dayName } = useLocalSearchParams();
  const [title, setTitle] = useState(planName + " - " + dayName);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      const blobsAndImages = await Promise.all(
        result.assets.map(async (asset) => {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          return { blob, image: asset.uri };
        })
      );

      const blobs = blobsAndImages.map((item) => item.blob);
      const images = blobsAndImages.map((item) => item.image);

      setBlobs(blobs);
      setImages(images);
    }
  };

  const createPost = async () => {
    setLoading(true);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dateDay = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${dateDay} ${hours}:${minutes}`;

    try {
      const userDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}`
      );

      const userPostsCollection = collection(userDocRef, "Posts");
      const userPostsDocRef = await addDoc(userPostsCollection, {
        title: title,
        caption: caption,
        date: formattedDateTime,
        userId: FIREBASE_AUTH.currentUser.uid,
        workoutId: workoutId,
      });

      const downloadUrls = [];
      for (let i = 0; i < blobs.length; i++) {
        try {
          const imageRef = ref(
            FIREBASE_STR,
            `posts/${userPostsDocRef.id}/${i}`
          );

          const uploadTask = uploadBytesResumable(imageRef, blobs[i]);

          const downloadUrl = await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done for image ${i + 1}`);
              },
              (error) => {
                console.error(`Error uploading image ${i + 1}:`, error);
                reject(error);
              },
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });

          downloadUrls.push(downloadUrl);
          console.log(`Image ${i + 1} uploaded successfully`);
        } catch (imageError) {
          console.error(`Error uploading image ${i + 1}:`, imageError);
        }
      }

      await updateDoc(userPostsDocRef, {
        id: userPostsDocRef.id,
        urls: downloadUrls,
      });
      console.log("added urls");
      addNotification(
        FIREBASE_AUTH.currentUser.uid,
        "post",
        userPostsDocRef.id
      );

      console.log("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
      router.push("/(tabs)/(workout)/plans");
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
            value={title}
          />
          <ScrollView>
            <Pressable onPress={pickImages}>
              {images.length > 0 ? (
                <ImageCarousel data={images} theme={theme} />
              ) : (
                <Card
                  wrapperStyle={{
                    width: ScreenWidth * 0.9,
                    height: ScreenWidth * 0.9 * 1.25,
                  }}
                ></Card>
              )}
            </Pressable>
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
                loading={loading}
                onPress={createPost}
                disabled={loading}
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
