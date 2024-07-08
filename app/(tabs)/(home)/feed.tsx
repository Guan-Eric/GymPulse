import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { Icon, useTheme, Button } from "@rneui/themed";
import { getFeed, toggleLike } from "../../../backend/post";
import PostItem from "../../../components/PostItem";
import { Post } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";

const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);

  async function fetchFeed() {
    try {
      const feed = await getFeed();
      setPosts(feed);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
    }, [])
  );

  const navigateProfile = (id: string) => {
    if (id === FIREBASE_AUTH.currentUser?.uid) {
      router.push("/(tabs)/(profile)/user");
    } else {
      router.push({
        pathname: "/(tabs)/(home)/profile",
        params: { userId: id },
      });
    }
  };

  const handleToggleLike = async (post: Post) => {
    const updatedPost = await toggleLike(post);
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ paddingBottom: -50 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "space-between",
          }}
        >
          <Text style={{ color: theme.colors.black }}>Feed</Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/search",
              })
            }
          >
            <Icon name="magnify" type="material-community" />
          </Pressable>
        </View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <PostItem
              post={item}
              theme={theme}
              navigateProfile={navigateProfile}
              onToggleLike={() => handleToggleLike(item)}
              renderComments={false}
              showCommentIcon={true}
              showUser={true}
              tab={"(home)"}
              viewPost={false}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default FeedScreen;
