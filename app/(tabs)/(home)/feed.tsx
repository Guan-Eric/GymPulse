import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Pressable,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { CheckBox, Icon, useTheme, Button } from "@rneui/themed";
import {
  collection,
  getCountFromServer,
  setDoc,
  addDoc,
  doc,
  query,
  getDocs,
  getDoc,
  orderBy,
  collectionGroup,
  where,
  deleteDoc,
} from "firebase/firestore";
import { ScreenWidth } from "@rneui/base";
import { Post } from "../../../components/types";
import { router } from "expo-router";
import { getFeed } from "../../../backend/post";

function FeedScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feed = await getFeed();
        setPosts(feed);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    fetchFeed();
  }, []);
  
  const toggleLike = async (post) => {
    try {
      const likeRef = doc(
        FIRESTORE_DB,
        `Users/${post.userId}/Posts/${post.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
      );

      if (post.like) {
        setPosts(
          posts.map((p) =>
            p.id === post.id
              ? { ...p, like: !p.like, numLikes: p.numLikes - 1 }
              : p
          )
        );
        await deleteDoc(likeRef);
      } else {
        setPosts(
          posts.map((p) =>
            p.id === post.id
              ? { ...p, like: !p.like, numLikes: p.numLikes + 1 }
              : p
          )
        );
        await setDoc(likeRef, {});
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setPosts(
        posts.map((p) => (p.id === post.id ? { ...p, like: !p.like } : p))
      );
    }
  };

  const navigateProfile = (id) => {
    if (id == FIREBASE_AUTH.currentUser.uid) {
      router.push("/(tabs)/(profile)/user");
    } else {
      router.push({
        pathname: "/(tabs)/(home)/profile",
        params: { userId: id },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <View>
          <Button type="clear" onPress={() => router.push("/(camera)/camera")}>
            <Icon name="camera-outline" type="material-community" />
          </Button>
        </View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={{ paddingBottom: 20 }}>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 5,
                  paddingLeft: 30,
                }}
                onPress={() => navigateProfile(item.userId)}
              >
                <Image
                  style={{ width: 40, height: 40 }}
                  source={require("../../../assets/profile.png")}
                />
                <Text style={[styles.userName, { color: theme.colors.black }]}>
                  {item.userName}
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(home)/post",
                    params: {
                      postId: item.id,
                      userId: item.userId,
                    },
                  })
                }
              >
                <Image
                  source={{ uri: item.url }}
                  style={{
                    alignSelf: "center",
                    borderRadius: 15,
                    width: 0.93 * ScreenWidth,
                    height: 0.93 * ScreenWidth * 1.25,
                    resizeMode: "cover",
                  }}
                />
              </Pressable>
              <View
                style={{
                  paddingLeft: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CheckBox
                  title={item.numLikes.toString()}
                  checked={item.like}
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
                  onPress={() => toggleLike(item)}
                />
                <Pressable
                  style={{ paddingRight: 30 }}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(home)/post",
                      params: {
                        postId: item.id,
                        userId: item.userId,
                      },
                    })
                  }
                >
                  <Icon name="comment-outline" type="material-community" />
                </Pressable>
              </View>

              <Text style={[styles.caption, { color: theme.colors.black }]}>
                {item.caption}
              </Text>
            </View>
          )}
        />
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
    fontSize: 14,
  },
});

export default FeedScreen;
