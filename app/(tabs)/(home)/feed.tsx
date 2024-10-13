import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { Icon, useTheme, Button } from "@rneui/themed";
import { getFeed, toggleLike } from "../../../backend/post";
import PostItem from "../../../components/PostItem";
import { Post } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";
import { usePushNotifications } from "../../../components/usePushNotifications";
import { savePushToken } from "../../../backend/user";
import { Instagram } from "react-content-loader/native";
import FeedLoader from "../../../components/FeedLoader";

const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const {
    expoPushToken,
    notification,
    hasNewNotification,
    markNotificationsAsRead,
  } = usePushNotifications();

  async function fetchFeed() {
    try {
      const feed = await getFeed();
      setPosts(feed);
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      savePushToken(expoPushToken.data);
    }
  }, [expoPushToken]);

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

  const navigateToNotifications = () => {
    markNotificationsAsRead();
    router.push({
      pathname: "/(tabs)/(home)/notification",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            paddingLeft: 25,
            paddingRight: 10,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Feed
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Button type="clear" onPress={navigateToNotifications}>
              {hasNewNotification ? (
                <Icon size={32} name="bell-badge" type="material-community" />
              ) : (
                <Icon size={32} name="bell" type="material-community" />
              )}
            </Button>
            <Button
              type="clear"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(home)/search",
                })
              }
            >
              <Icon size={32} name="magnify" type="material-community" />
            </Button>
          </View>
        </View>
        {loading ? (
          <View style={{ alignItems: "center" }}>
            <FeedLoader theme={theme} />
            <FeedLoader theme={theme} />
          </View>
        ) : (
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
                showUser={true}
                tab={"(home)"}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
    fontWeight: "bold",
  },
});
