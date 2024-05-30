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
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
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
import { Post } from "../../../components/types";
import { router, useLocalSearchParams } from "expo-router";
import {
  addComment,
  getUserPost,
  getUserPostComments,
  toggleLike,
} from "../../../backend/post";

function ViewPostScreen() {
  const { theme } = useTheme();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState<Post>();

  const { userId, postId } = useLocalSearchParams();

  useEffect(() => {
    async function fetchUserPost() {
      try {
        setPost(await getUserPost(userId as string, postId as string));
        setComments(
          await getUserPostComments(userId as string, postId as string)
        );
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    }
    fetchUserPost();
  }, []);

  const navigateProfile = () => {
    if (post.userId == FIREBASE_AUTH.currentUser.uid) {
      router.push("/(tabs)/(profile)/user");
    } else {
      router.push({
        pathname: "/(tabs)/(profile)/profile",
        params: { userId: post.userId },
      });
    }
  };

  const handleToggleLike = async () => {
    setPost(await toggleLike(post));
  };

  const handleAddComment = async () => {
    if (post && comment) {
      await addComment(comment, post);
      setComments([...comments, { userName: "Current user", comment }]);
      setComment("");
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
            onPress={() => navigateProfile()}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={require("../../../assets/profile.png")}
            />
            <Text style={[styles.userName, { color: theme.colors.black }]}>
              {post?.userName}
            </Text>
          </Pressable>
          <Image
            source={{ uri: post?.url }}
            style={{
              alignSelf: "center",
              borderRadius: 15,
              width: 0.93 * ScreenWidth,
              height: 0.93 * ScreenWidth * 1.25,
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
              onPress={handleToggleLike}
            />
          </View>
          <Text style={[styles.caption, { color: theme.colors.black }]}>
            {post?.caption}
          </Text>
          {comments?.map((item) => (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[styles.commentUserName, { color: theme.colors.black }]}
              >
                {item.userName}
              </Text>
              <Text style={[styles.comment, { color: theme.colors.black }]}>
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
              onPress={handleAddComment}
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
