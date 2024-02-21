import React, { useEffect, useState } from "react";
import { Button, FlatList, View, Pressable, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { CheckBox, Icon } from "@rneui/themed";
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

          await setDoc(
            doc(FIRESTORE_DB, `Following/${FIREBASE_AUTH.currentUser.uid}`),
            {}
          );
        } else {
          const userFollowingCollection = collection(
            doc(FIRESTORE_DB, `Following/${FIREBASE_AUTH.currentUser.uid}`),
            "UserFollowing"
          );

          const userFollowingSnapshot = await getDocs(userFollowingCollection);
          const data = userFollowingSnapshot.docs.map((doc) => doc.id);
          if (data.length > 0) {
            const followingUserPostsQuery = query(
              collectionGroup(FIRESTORE_DB, "UserPosts"),
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
                  `Posts/${postData.userId}/UserPosts/${postData.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
                );
                const numLikesCollection = collection(
                  FIRESTORE_DB,
                  `Posts/${postData.userId}/UserPosts/${postData.id}/Likes/`
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
                    numLikes: numLikesSnapshot.data().count.toString(),
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
      setPosts(
        posts.map((p) => (p.id === post.id ? { ...p, like: !p.like } : p))
      );

      const likeRef = doc(
        FIRESTORE_DB,
        `Posts/${post.userId}/UserPosts/${post.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
      );

      if (post.like) {
        await deleteDoc(likeRef);
      } else {
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
    <View>
      <SafeAreaView>
        <Button title="Camera" onPress={() => navigation.navigate("Camera")} />
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View>
              <Pressable onPress={() => navigateProfile(item.userId)}>
                <Text>{item.userName}</Text>
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
                    width: ScreenWidth,
                    height: ScreenWidth * 1.25,
                    resizeMode: "cover",
                  }}
                />
              </Pressable>
              <CheckBox
                title={item.numLikes}
                checked={item.like}
                checkedIcon={
                  <Icon
                    name="arm-flex"
                    type="material-community"
                    color="#ffde34"
                  />
                }
                uncheckedIcon={
                  <Icon name="arm-flex-outline" type="material-community" />
                }
                onPress={() => toggleLike(item)}
              />
              <Text>{item.caption}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

export default FeedScreen;
