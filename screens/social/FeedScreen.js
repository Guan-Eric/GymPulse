import React, { useEffect, useState } from "react";
import { Button, FlatList, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  doc,
  query,
  getDocs,
  getDoc,
  orderBy,
  collectionGroup,
  where,
} from "firebase/firestore";

function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
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
          });

          await addDoc(
            FIRESTORE_DB,
            `Following/${FIREBASE_AUTH.currentUser.uid}`
          );
          await addDoc(
            FIRESTORE_DB,
            `Followers/${FIREBASE_AUTH.currentUser.uid}`
          );
          await addDoc(
            FIRESTORE_DB,
            `UserLikes/${FIREBASE_AUTH.currentUser.uid}`
          );
        } else {
          const userFollowingCollection = collection(
            doc(FIRESTORE_DB, `Following/${FIREBASE_AUTH.currentUser.uid}`),
            "UserFollowing"
          );
          const userFollowingSnapshot = await getDocs(userFollowingCollection);
          const data = userFollowingSnapshot.docs.map((doc) => doc.id);
          console.log(data);

          const followingUserPostsQuery = query(
            collectionGroup(FIRESTORE_DB, "UserPosts"),
            orderBy("date", "desc"),
            where("userId", "in", data)
          );
          const followingUserPostsSnapshot = await getDocs(
            followingUserPostsQuery
          );
          const followingPosts = followingUserPostsSnapshot.docs.map((doc) =>
            doc.data()
          );
          console.log(followingPosts);
          setPosts(followingPosts);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    fetchFeedFromFirestore();
  }, []);
  return (
    <View>
      <SafeAreaView>
        <Button title="Camera" onPress={() => navigation.navigate("Camera")} />
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <Pressable>
              <Image
                source={{ uri: item.url }}
                style={{
                  width: 400,
                  height: 400,
                  resizeMode: "cover",
                }}
              />
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

export default FeedScreen;
