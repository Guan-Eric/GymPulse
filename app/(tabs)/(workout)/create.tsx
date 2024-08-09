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
import { Input, useTheme, Button, Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { addNotification } from "../../../backend/user";
import Carousel from "react-native-reanimated-carousel";

function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const { workoutId } = useLocalSearchParams();

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
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
        try {
          const response = await fetch(images[i]);

          const blob = await response.blob();

          const imageRef = ref(
            FIREBASE_STR,
            `posts/${userPostsDocRef.id}/${i}`
          );

          await uploadBytes(imageRef, blob);

          const downloadUrl = await getDownloadURL(imageRef);

          downloadUrls.push(downloadUrl);
          await sleep(1000);
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
      router.push("/(tabs)/(workout)/plans");
    }
  };

  const renderCarouselItem = ({ item }) => (
    <View style={{ width: ScreenWidth, height: ScreenWidth }}>
      <Image
        source={{ uri: item }}
        style={{
          alignSelf: "center",
          borderRadius: 20,
          width: ScreenWidth * 0.95,
          height: ScreenWidth * 0.95 * 1.25,
          resizeMode: "cover",
        }}
      />
    </View>
  );

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
            <Pressable onPress={pickImages}>
              {images.length > 0 ? (
                <Carousel
                  panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                  }}
                  style={{ alignSelf: "center" }}
                  data={images}
                  renderItem={renderCarouselItem}
                  width={ScreenWidth}
                  height={ScreenWidth * 1.25}
                  scrollAnimationDuration={1000}
                  loop={false}
                />
              ) : (
                <Card
                  wrapperStyle={{
                    width: ScreenWidth * 0.95,
                    height: (ScreenWidth * 0.95) / (195 / 130),
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
