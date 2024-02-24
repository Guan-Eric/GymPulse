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
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme, Button } from "@rneui/themed";
import {
  collection,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ScreenWidth } from "@rneui/base";

function ViewProfileScreen({ navigation, route }) {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [following, setFollowing] = useState();
  const [loading, setLoading] = useState(true);

  const imageWidth = ScreenWidth / 3;

  useEffect(() => {
    setLoading(true);
    const fetchUserAndUserPostsFirestore = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, `Users/${route.params.userId}`);
        const userDocSnapshot = await getDoc(userDocRef);
        setUser(userDocSnapshot.data());

        const followingDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Following/${route.params.userId}`
        );
        const followingSnapshot = await getDoc(followingDocRef);
        setFollowing(followingSnapshot.exists());

        const userPostsCollection = collection(
          FIRESTORE_DB,
          `Users/${route.params.userId}/Posts`
        );
        const queryRef = query(userPostsCollection, orderBy("date", "desc"));
        const querySnapshot = await getDocs(queryRef);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setPosts(data);
      } catch (error) {
        console.error("Error fetching user and userPosts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndUserPostsFirestore();
  }, []);

  const toggleFollow = async () => {
    try {
      const followingDocRef = doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH.currentUser.uid}/Following/${route.params.userId}`
      );
      setFollowing(!following);
      if (following) {
        await deleteDoc(followingDocRef);
      } else {
        await setDoc(followingDocRef, {});
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setFollowing(!following);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
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
              source={require("../../assets/profile.png")}
            />
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name}
            </Text>

            {following ? (
              <Button size="sm" title="Unfollow" onPress={toggleFollow} />
            ) : (
              <Button size="sm" title="Follow" onPress={toggleFollow} />
            )}
          </View>
          {user?.bio != "" ? (
            <Text style={[styles.bio, { color: theme.colors.text }]}>
              {user?.bio}
            </Text>
          ) : null}
          <FlatList
            numColumns={3}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
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
                    width: imageWidth,
                    height: imageWidth,
                    resizeMode: "cover",
                  }}
                />
              </Pressable>
            )}
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
