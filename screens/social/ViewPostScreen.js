import React, { useState, useEffect } from "react";
import { Button, View, FlatList, Pressable, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme, CheckBox, Icon } from "@rneui/themed";
import {
  collection,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ScreenWidth } from "@rneui/base";

function ViewPostScreen({ navigation, route }) {
  const { theme } = useTheme();
  const [post, setPost] = useState();

  useEffect(() => {
    const fetchUserAndUserPostFirestore = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, `Users/${route.params.userId}`);
        const userDocSnapshot = await getDoc(userDocRef);

        const userPostDocRef = doc(
          FIRESTORE_DB,
          `Posts/${route.params.userId}/UserPosts/${route.params.postId}`
        );
        const userPostSnapshot = await getDoc(userPostDocRef);
        const postData = userPostSnapshot.data();
        const userLikeDocRef = doc(
          FIRESTORE_DB,
          `Posts/${route.params.userId}/UserPosts/${route.params.postId}/Likes/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userLikeSnapshot = await getDoc(userLikeDocRef);
        const numLikesCollection = collection(
          FIRESTORE_DB,
          `Posts/${route.params.userId}/UserPosts/${route.params.postId}/Likes/`
        );
        const numLikesSnapshot = await getCountFromServer(numLikesCollection);

        if (userDocSnapshot.exists()) {
          setPost({
            ...postData,
            userName: userDocSnapshot.data().name,
            like: userLikeSnapshot.exists(),
            numLikes: numLikesSnapshot.data().count,
          });
        }
        console.log(postData);
      } catch (error) {
        console.error("Error fetching user and userPosts:", error);
      }
    };
    fetchUserAndUserPostFirestore();
  }, []);

  const toggleLike = async (post) => {
    try {
      const likeRef = doc(
        FIRESTORE_DB,
        `Posts/${post.userId}/UserPosts/${post.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
      );

      if (post.like) {
        setPost({ ...post, like: !post.like, numLikes: post.numLikes - 1 });
        await deleteDoc(likeRef);
      } else {
        setPost({ ...post, like: !post.like, numLikes: post.numLikes + 1 });
        await setDoc(likeRef, {});
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setPost({ ...post, like: !post.like });
    }
  };

  const navigateProfile = () => {
    if (post.userId == FIREBASE_AUTH.currentUser.uid) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("ViewProfile", { userId: post.userId });
    }
  };
  return (
    <View>
      <SafeAreaView>
        <View>
          <Pressable onPress={navigateProfile}>
            <Text>{post?.userName}</Text>
          </Pressable>
          <Image
            source={{ uri: post?.url }}
            style={{
              width: ScreenWidth,
              height: ScreenWidth * 1.25,
              resizeMode: "cover",
            }}
          />
          <CheckBox
            title={post?.numLikes}
            checked={post?.like}
            checkedIcon={
              <Icon name="arm-flex" type="material-community" color="#ffde34" />
            }
            uncheckedIcon={
              <Icon name="arm-flex-outline" type="material-community" />
            }
            onPress={() => toggleLike(post)}
          />
          <Text>{post?.caption}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default ViewPostScreen;
