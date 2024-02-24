import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  StyleSheet,
  Pressable,
  Image,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme, CheckBox, Icon, Input } from "@rneui/themed";
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
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({ comments: [] });

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
          `Users/${route.params.userId}/Posts/${route.params.postId}/Comments/`
        );
        const commentsQueryRef = query(
          postCommentsCollection,
          orderBy("date", "desc")
        );
        const fetchUserNamePromises = [];
        const commentsQuerySnapshot = await getDocs(commentsQueryRef);
        commentsQuerySnapshot.forEach((doc) => {
          const promise = fetchCommentUserName(doc.data().userId).then(
            (userName) => {
              return {
                userName: userName,
                comment: doc.data().comment,
              };
            }
          );
          fetchUserNamePromises.push(promise);
        });

        // Wait for all promises to resolve
        const comments = await Promise.all(fetchUserNamePromises);
        setComments(comments);
        if (userDocSnapshot.exists()) {
          setPost({
            ...userPostSnapshot.data(),
            userName: userDocSnapshot.data().name,
            like: userLikeSnapshot.exists(),
            numLikes: numLikesSnapshot.data().count,
          });
        }
      } catch (error) {
        console.error("Error fetching user and userPosts:", error);
      }
    };
    const fetchCommentUserName = async (userId) => {
      const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);
      const userDocSnapshot = await getDoc(userDocRef);
      return userDocSnapshot.data().name;
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
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dateDay = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${dateDay} ${hours}:${minutes}`;
    try {
      const commentCollectionRef = collection(
        FIRESTORE_DB,
        `Users/${post.userId}/Posts/${post.id}/Comments/`
      );
      const commentDocRef = await addDoc(commentCollectionRef, {
        comment: comment,
        userId: post.userId,
        date: formattedDateTime,
      });
      const commentDoc = doc(commentCollectionRef, commentDocRef.id);
      await updateDoc(commentDoc, {
        id: commentDocRef.id,
      });
      setComment("");
      setComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <ScrollView>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 5,
              paddingLeft: 30,
            }}
            onPress={() => navigateProfile(route.params.userId)}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={require("../../assets/profile.png")}
            />
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {post?.userName}
            </Text>
          </Pressable>
          <Image
            source={{ uri: post?.url }}
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
              paddingLeft: 10,
            }}
          >
            <CheckBox
              title={post?.numLikes?.toString()}
              checked={post?.like}
              checkedIcon={
                <Icon
                  size={28}
                  name="arm-flex"
                  type="material-community"
                  color="#ffde34"
                />
              }
              uncheckedIcon={
                <Icon
                  size={28}
                  name="arm-flex-outline"
                  type="material-community"
                />
              }
              onPress={() => toggleLike(post)}
            />
          </View>
          <Text style={[styles.caption, { color: theme.colors.text }]}>
            {post?.caption}
          </Text>
          {comments?.map((item) => (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[styles.commentUserName, { color: theme.colors.text }]}
              >
                {item.userName}
              </Text>
              <Text style={[styles.comment, { color: theme.colors.text }]}>
                {item.comment}
              </Text>
            </View>
          ))}
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 15,
              paddingRight: 25,
            }}
          >
            <Input
              containerStyle={{ width: 300 }}
              onChangeText={(comment) => setComment(comment)}
              value={comment}
              placeholder="Comment here"
              autoCapitalize="none"
            />
            <Button
              disabled={comment == ""}
              title="Post"
              onPress={postComment}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  userName: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    paddingLeft: 10,
  },
  caption: {
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 10,
    fontSize: 14,
  },
  comment: {
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 5,
    paddingRight: 25,
    fontSize: 16,
  },
  commentUserName: {
    fontFamily: "Lato_700Bold",
    paddingLeft: 25,
    fontSize: 16,
  },
});

export default ViewPostScreen;
