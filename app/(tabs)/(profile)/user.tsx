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
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme, Button, Icon } from "@rneui/themed";
import {
  collection,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ScreenWidth } from "@rneui/base";
import { Post, User } from "../../../components/types";
import { router } from "expo-router";
import { getUser } from "../../../backend/user";
import { getUserPosts } from "../../../backend/post";
import PostItem from "../../../components/PostItem";

function UserScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const imageWidth = ScreenWidth / 3;

  useEffect(() => {
    setLoading(true);
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
    fetchUserAndUserPostsFirestore();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Button
          style={{
            width: 50,
            alignSelf: "flex-end",
          }}
          type="clear"
          onPress={() => router.push("/(tabs)/(profile)/settings")}
        >
          <Icon name="cog-outline" type="material-community" />
        </Button>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 5,
              paddingLeft: 10,
            }}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={require("../../../assets/profile.png")}
            />
            <Text style={[styles.userName, { color: theme.colors.black }]}>
              {user?.name}
            </Text>
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
                tab={"(profile)"}
              />
            )}
            keyExtractor={(item) => item.id}
          />
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
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
    paddingBottom: 15,
  },
});

export default UserScreen;
