import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  FlatList,
  Pressable,
  Image,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme, CheckBox, Icon } from "@rneui/themed";
import {
  collection,
  updateDoc,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { ScreenWidth } from "@rneui/base";

function ViewPostScreen({ navigation, route }) {
  const { theme } = useTheme();
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchUserAndUserPostFirestore = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, `Users/${route.params.userId}`);
        const userDocSnapshot = await getDoc(userDocRef);

        const userPostDocRef = doc(
          FIRESTORE_DB,
          `Users/${route.params.userId}/Posts/${route.params.postId}`
        );
        const userPostSnapshot = await getDoc(userPostDocRef);

        const userLikeDocRef = doc(
          FIRESTORE_DB,
          `Users/${route.params.userId}/Posts/${route.params.postId}/Likes/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userLikeSnapshot = await getDoc(userLikeDocRef);

        const numLikesCollection = collection(
          FIRESTORE_DB,
          `Users/${route.params.userId}/Posts/${route.params.postId}/Likes/`
        );
        const numLikesSnapshot = await getCountFromServer(numLikesCollection);

        const postCommentsCollection = collection(
          FIRESTORE_DB,
          `User/${route.params.userId}/Posts/${route.params.postId}/Comments/`
        );
        const commentsQueryRef = query(
          postCommentsCollection,
          orderBy("date", "desc")
        );
        const commentsQuerySnapshot = await getDocs(commentsQueryRef);
        const comments = [];
        commentsQuerySnapshot.forEach((doc) => {
          comments.push(doc.data());
        });
        if (userDocSnapshot.exists()) {
          setPost({
            ...userPostSnapshot.data(),
            userName: userDocSnapshot.data().name,
            like: userLikeSnapshot.exists(),
            numLikes: numLikesSnapshot.data().count,
            comments: comments,
          });
        }
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
        `Users/${post.userId}/Posts/${post.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
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

  const postComment = async () => {
    try {
      const commentCollectionRef = collection(
        FIRESTORE_DB,
        `Users/${post.userId}/Posts/${post.id}/Comments/`
      );
      const commentDocRef = await addDoc(commentCollectionRef, {
        comment: comment,
        userId: post.userId,
      });
      const commentDoc = doc(commentCollectionRef, commentDocRef.id);
      await updateDoc(commentDoc, {
        id: commentDocRef.id,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  return (
    <View>
      <SafeAreaView>
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
          title={post?.numLikes.toString()}
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
        {post?.comments.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
        <TextInput
          onChangeText={(comment) => setComment(comment)}
          placeholder="Comment Here"
          autoCapitalize="none"
        />
        <Button title="Post" onPress={postComment} />
      </SafeAreaView>
    </View>
  );
}

export default ViewPostScreen;
