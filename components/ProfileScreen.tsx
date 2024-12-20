import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Button, Avatar } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { Post, User } from "./types";
import { router, useLocalSearchParams } from "expo-router";
import {
  getUser,
  getUserFollowing,
  removeFollowRequest,
  sendFollowRequest,
  toggleFollow,
} from "../backend/user";
import { getUserPosts } from "../backend/post";
import PostItem from "./PostItem";
import { FIREBASE_AUTH } from "../firebaseConfig";
import TruncatedText from "./TruncatedText";
import StreakTooltip from "./StreakTooltip";
import BackButton from "./BackButton";
import FeedLoader from "./loader/FeedLoader";

function ViewProfileScreen({ theme, userId }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const [following, setFollowing] = useState<
    "following" | "requested" | "notFollowing"
  >("notFollowing");
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState<number>();
  const [longestStreak, setLongestStreak] = useState<number>();

  useEffect(() => {
    setLoading(true);
    const fetchUserAndUserPostsFirestore = async () => {
      try {
        setUser(await getUser(userId as string));
        setFollowing(
          (await getUserFollowing(userId as string)) as
            | "following"
            | "requested"
            | "notFollowing"
        );
        setPosts(await getUserPosts(userId as string));
        setCurrentStreak((await getUser(userId)).currentStreak);
        setLongestStreak((await getUser(userId)).longestStreak);
      } catch (error) {
        console.error("Error fetching user and userPosts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndUserPostsFirestore();
  }, []);

  const handleToggleFollow = async () => {
    if (following == "following") {
      await toggleFollow(userId as string, FIREBASE_AUTH.currentUser.uid, true);
      setFollowing("notFollowing");
    } else if (following == "notFollowing") {
      await sendFollowRequest(userId as string);
      setFollowing("requested");
    } else {
      await removeFollowRequest(userId as string);
      setFollowing("notFollowing");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 10,
        marginBottom: Platform.OS == "ios" ? -35 : 0,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 5,
            paddingRight: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton />
            <Avatar rounded size={40} source={{ uri: user?.url }} />
            <Text style={[styles.userName, { color: theme.colors.black }]}>
              {user?.username}
            </Text>
            {following == "following" ? (
              <Button size="sm" title="Unfollow" onPress={handleToggleFollow} />
            ) : following == "notFollowing" ? (
              <Button size="sm" title="Follow" onPress={handleToggleFollow} />
            ) : (
              <Button
                size="sm"
                title="requested"
                onPress={handleToggleFollow}
              />
            )}
          </View>

          {user?.showStreak ? (
            <StreakTooltip
              currentStreak={currentStreak}
              longestStreak={longestStreak}
            />
          ) : null}
        </View>
        {user?.bio != "" ? (
          <TruncatedText theme={theme} children={user?.bio} />
        ) : null}
        {loading ? (
          <>
            <FeedLoader theme={theme} />
            <FeedLoader theme={theme} />
          </>
        ) : posts.length > 0 ? (
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <PostItem
                post={item}
                theme={theme}
                navigateProfile={null}
                onToggleLike={null}
                renderComments={false}
                showUser={false}
                tab={"(profile)"}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={{ alignItems: "center", paddingTop: 100 }}>
            <Text style={[styles.message, { color: theme.colors.black }]}>
              No posts...
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  userName: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
  },
  bio: {
    fontFamily: "Lato_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
    paddingBottom: 15,
  },
  message: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
});
export default ViewProfileScreen;
