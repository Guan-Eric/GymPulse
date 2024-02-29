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
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
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

function FeedScreen({ navigation }) {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFeedFromFirestore = async () => {
      try {
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            name: "",
            email: FIREBASE_AUTH.currentUser.email,
            darkMode: true,
            metricUnits: false,
            bio: "",
            id: FIREBASE_AUTH.currentUser.uid,
          });
        } else {
          const userFollowingCollection = collection(
            doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`),
            "Following"
          );

          const userFollowingSnapshot = await getDocs(userFollowingCollection);
          const data = userFollowingSnapshot.docs.map((doc) => doc.id);
          if (data.length > 0) {
            const followingUserPostsQuery = query(
              collectionGroup(FIRESTORE_DB, "Posts"),
              orderBy("date", "desc"),
              where("userId", "in", data)
            );

            const followingUserPostsSnapshot = await getDocs(
              followingUserPostsQuery
            );

            const followingPosts = await Promise.all(
              followingUserPostsSnapshot.docs.map(async (document) => {
                const postData = document.data();
                const userDocRef = doc(
                  FIRESTORE_DB,
                  `Users/${postData.userId}`
                );
                const userDocSnapshot = await getDoc(userDocRef);
                const userLikeDocRef = doc(
                  FIRESTORE_DB,
                  `Users/${postData.userId}/Posts/${postData.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
                );
                const numLikesCollection = collection(
                  FIRESTORE_DB,
                  `Users/${postData.userId}/Posts/${postData.id}/Likes/`
                );
                const numLikesSnapshot = await getCountFromServer(
                  numLikesCollection
                );
                const userLikeSnapshot = await getDoc(userLikeDocRef);
                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();

                  return {
                    ...postData,
                    userName: userData.name,
                    like: userLikeSnapshot.exists(),
                    numLikes: numLikesSnapshot.data().count,
                  };
                }
                return postData;
              })
            );
            setPosts(followingPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    fetchFeedFromFirestore();
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
      navigation.navigate("Profile");
    } else {
      navigation.navigate("ViewProfile", { userId: id });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <View>
          <Button type="clear" onPress={() => navigation.navigate("Camera")}>
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
                  source={require("../../assets/profile.png")}
                />
                <Text style={[styles.userName, { color: theme.colors.black }]}>
                  {item.userName}
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate("ViewPost", {
                    postId: item.id,
                    userId: item.userId,
                  })
                }
              >
                <Image
                  source={{ uri: item.url }}
                  style={{
                    alignSelf: "center",
                    borderRadius: 20,
                    width: 0.9 * ScreenWidth,
                    height: 0.9 * ScreenWidth * 1.25,
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
                    navigation.navigate("ViewPost", {
                      postId: item.id,
                      userId: item.userId,
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
