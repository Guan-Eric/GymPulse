import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme, Button, Icon, Avatar } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { Post, User } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";
import { getUser, updateUserAvatar } from "../../../backend/user";
import { getUserPosts } from "../../../backend/post";
import PostItem from "../../../components/PostItem";
import ProfileLoader from "../../../components/ProfileLoader";
import * as ImagePicker from "expo-image-picker";

function UserScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const imageWidth = ScreenWidth / 3;

  const fetchUserAndUserPostsFirestore = async () => {
    try {
      setUser(await getUser(FIREBASE_AUTH.currentUser.uid));
      setPosts(await getUserPosts(FIREBASE_AUTH.currentUser.uid));
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
      const newAvatarUrl = result.assets[0].uri;
      setUser((prevUser) => ({ ...prevUser, url: newAvatarUrl }));
      await updateUserAvatar(newAvatarUrl);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
            <Button onPress={() => router.push("/(tabs)/(profile)/summary")}>
              Summary
            </Button>
          </View>
          <Button
            type="clear"
            onPress={() => router.push("/(tabs)/(profile)/settings")}
          >
            <Icon size={32} name="cog" type="material-community" />
          </Button>
        </View>
        <View>
          {user?.bio != "" ? (
            <Text style={[styles.bio, { color: theme.colors.black }]}>
              {user?.bio}
            </Text>
          ) : null}
          {loading ? (
            <>
              <ProfileLoader theme={theme} />
              <ProfileLoader theme={theme} />
            </>
          ) : (
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
    fontFamily: "Alata_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
  },
});

export default UserScreen;
