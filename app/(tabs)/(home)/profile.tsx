import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Button, Avatar } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { Post, User } from "../../../components/types";
import { router, useLocalSearchParams } from "expo-router";
import {
  getUser,
  getUserFollowing,
  removeFollowRequest,
  sendFollowRequest,
  toggleFollow,
} from "../../../backend/user";
import { getUserPosts } from "../../../backend/post";
import PostItem from "../../../components/PostItem";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

function ViewProfileScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const [following, setFollowing] = useState("");
  const [loading, setLoading] = useState(true);

  const { userId } = useLocalSearchParams();

  const imageWidth = ScreenWidth / 3;

  useEffect(() => {
    setLoading(true);
    const fetchUserAndUserPostsFirestore = async () => {
      try {
        setUser(await getUser(userId as string));
        setFollowing(await getUserFollowing(userId as string));
        setPosts(await getUserPosts(userId as string));
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
            paddingLeft: 10,
          }}
        >
          <Avatar rounded size={40} source={{ uri: user?.url }} />
          <Text style={[styles.userName, { color: theme.colors.black }]}>
            {user?.username}
          </Text>

          {following == "following" ? (
            <Button size="sm" title="Following" onPress={handleToggleFollow} />
          ) : following == "notFollowing" ? (
            <Button size="sm" title="Follow" onPress={handleToggleFollow} />
          ) : (
            <Button
              size="sm"
              color="gray"
              title="Requested"
              onPress={handleToggleFollow}
            />
          )}
        </View>
        {user?.bio != "" ? (
          <Text style={[styles.bio, { color: theme.colors.black }]}>
            {user?.bio}
          </Text>
        ) : null}
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
              showCommentIcon={true}
              showUser={false}
              tab={"(home)"}
              viewPost={false}
            />
          )}
          keyExtractor={(item) => item.id}
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
    paddingRight: 10,
  },
  bio: {
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
    paddingBottom: 15,
  },
});
export default ViewProfileScreen;
