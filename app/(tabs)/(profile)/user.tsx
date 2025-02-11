import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_STR } from "../../../firebaseConfig";
import { useTheme, Button, Icon, Avatar } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { Post, User } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";
import { getUser, updateUserAvatar } from "../../../backend/user";
import { getUserPosts } from "../../../backend/post";
import PostItem from "../../../components/PostItem";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FeedLoader from "../../../components/loader/FeedLoader";
import StreakModal from "../../../components/modal/StreakModal";

function UserScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const [currentStreak, setCurrentStreak] = useState<number>();
  const [longestStreak, setLongestStreak] = useState<number>();
  const [loading, setLoading] = useState(true);

  const fetchUserAndUserPostsFirestore = async () => {
    try {
      setUser(await getUser(FIREBASE_AUTH.currentUser.uid));
      setPosts(await getUserPosts(FIREBASE_AUTH.currentUser.uid));
      setCurrentStreak(
        (await getUser(FIREBASE_AUTH.currentUser.uid)).currentStreak
      );
      setLongestStreak(
        (await getUser(FIREBASE_AUTH.currentUser.uid)).longestStreak
      );
    } catch (error) {
      console.error("Error fetching user and userPosts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserAndUserPostsFirestore();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserAndUserPostsFirestore();
    }, [])
  );

  const updateAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Permission to access the gallery is required."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      try {
        const response = await fetch(localUri);
        const blob = await response.blob();
        const userId = FIREBASE_AUTH.currentUser?.uid;

        const avatarRef = ref(FIREBASE_STR, `profile/${userId}.jpg`);

        await uploadBytes(avatarRef, blob);

        const newAvatarUrl = await getDownloadURL(avatarRef);

        setUser((prevUser) => ({ ...prevUser, url: newAvatarUrl }));
        await updateUserAvatar(newAvatarUrl);

        Alert.alert("Success", "Avatar updated successfully!");
      } catch (error) {
        console.error("Error updating avatar:", error);
        Alert.alert("Error", "Failed to update avatar. Please try again.");
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: Platform.OS == "ios" ? 20 : 0,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button type="clear" onPress={updateAvatar}>
              <Avatar rounded size={40} source={{ uri: user?.url }} />
            </Button>
            <Text style={[styles.userName, { color: theme.colors.black }]}>
              {user?.username}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <StreakModal
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              theme={theme}
            />
            <Button
              type="clear"
              onPress={() => router.push("/(tabs)/(profile)/settings")}
            >
              <Icon size={32} name="cog" type="material-community" />
            </Button>
          </View>
        </View>
        <View>
          {user?.bio != "" ? (
            <Text style={[styles.bio, { color: theme.colors.black }]}>
              {user?.bio}
            </Text>
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
                No posts yet...
              </Text>
              <Text style={[styles.message, { color: theme.colors.black }]}>
                Start a workout!
              </Text>
            </View>
          )}
        </View>
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
  bio: {
    fontFamily: "Lato_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
  },
  message: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
});

export default UserScreen;
