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

function UserScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const imageWidth = ScreenWidth / 3;

  useEffect(() => {
    setLoading(true);
    const fetchUserAndUserPostsFirestore = async () => {
      try {
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userDocSnapshot = await getDoc(userDocRef);
        setUser(userDocSnapshot.data() as User);

        const userPostsCollection = collection(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}/Posts`
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
  return (
    <View style={{ flex: 1 }}>
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
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          {user?.bio != "" ? <Text style={styles.bio}>{user?.bio}</Text> : null}
          <FlatList
            numColumns={3}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(profile)/post",
                    params: { userId: user.id },
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
