import React, { useEffect, useState } from "react";
import {
  FIREBASE_AUTH,
  FIRESTORE_DB,
  FIREBASE_STR,
} from "../../../firebaseConfig";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ScreenWidth } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import { Input, useTheme, Button, Card, Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  addNotification,
  getUserFollowers,
  incrementStreak,
} from "../../../backend/user";
import ImageCarousel from "../../../components/PostCarousel";
import { setParams } from "expo-router/build/global-state/routing";
import { deleteWorkout, getWorkout } from "../../../backend/workout";

function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const { theme } = useTheme();
  const [blobs, setBlobs] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const { workoutId, planName, planId, dayId } = useLocalSearchParams();
  const [title, setTitle] = useState(planName as string);

  const fetchWorkoutTime = async () => {
    setWorkoutTime(
      (await getWorkout(workoutId as string, FIREBASE_AUTH.currentUser.uid))
        .duration
    );
  };
  useEffect(() => {
    fetchWorkoutTime();
  }, []);

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

    try {
      const userPostsCollection = collection(
        doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`),
        "Posts"
      );
      const userPostsDocRef = await addDoc(userPostsCollection, {
        title: title,
        caption: caption,
        date: currentDate,
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
        } catch (imageError) {
          console.error(`Error uploading image ${i + 1}:`, imageError);
        }
      }

      await updateDoc(userPostsDocRef, {
        id: userPostsDocRef.id,
        urls: downloadUrls,
      });

      const userFollowers = await getUserFollowers(
        FIREBASE_AUTH.currentUser.uid
      );
      for (const userFollower of userFollowers) {
        addNotification(userFollower, "post", userPostsDocRef.id);
      }
      incrementStreak();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
      router.push("/(tabs)/(home)/feed");
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
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
              <View
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                  flexDirection: "row",
                }}
              >
                <Button
                  type="clear"
                  buttonStyle={[styles.cancelButton]}
                  onPress={() => {
                    deleteWorkout(workoutId as string);
                    router.push({
                      pathname: "/(tabs)/(workout)/workout",
                      params: {
                        planId: planId,
                        dayId: dayId,
                        workoutTime: workoutTime,
                      },
                    });
                  }}
                  icon={<Icon name="chevron-left" size={30} />}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  inputStyle={{ color: theme.colors.black }}
                  inputContainerStyle={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.colors.grey0,
                      borderColor: theme.colors.grey1,
                    },
                  ]}
                  containerStyle={{
                    width: 200,
                    paddingLeft: 20,
                  }}
                  maxLength={50}
                  onChangeText={(text) => setTitle(text)}
                  value={title}
                  label={"Post Title"}
                />
                <Button
                  buttonStyle={styles.postButton}
                  title="Post"
                  loading={loading}
                  onPress={createPost}
                  disabled={loading}
                />
              </View>
              <Pressable onPress={pickImages}>
                {images.length > 0 ? (
                  <ImageCarousel data={images} theme={theme} />
                ) : (
                  <Card
                    containerStyle={{
                      alignSelf: "center",
                      borderRadius: 20,
                      backgroundColor: theme.colors.grey0,
                      borderColor: theme.colors.grey0,
                      width: ScreenWidth * 0.9,
                      height: ScreenWidth * 0.9 * 1.25,
                    }}
                  >
                    <Card.Title>
                      <Text>Click to Add Pictures</Text>
                    </Card.Title>
                  </Card>
                )}
              </Pressable>

              <View
                style={{ paddingTop: 10, paddingLeft: 15, paddingRight: 15 }}
              >
                <Input
                  inputStyle={{ color: theme.colors.black }}
                  inputContainerStyle={styles.caption}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                  onChangeText={(text) => setCaption(text)}
                  placeholder="Write caption here"
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  postButton: {
    borderRadius: 10,
    width: 85,
    height: 40,
    marginBottom: 3,
    marginRight: 20,
  },
  cancelButton: {
    borderRadius: 10,
  },
  caption: { borderColor: "transparent" },
  inputContainer: {
    borderWidth: 2,
    borderBottomWidth: 2,
    width: 240,
    height: 40,
    borderRadius: 10,
    paddingLeft: 5,
  },
});

export default CreatePostScreen;
