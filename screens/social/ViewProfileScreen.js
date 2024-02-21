import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  FlatList,
  Pressable,
  Image,
  Text,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "@rneui/themed";
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

function ViewProfileScreen({ navigation, route }) {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const imageWidth = ScreenWidth / 3;

  useEffect(() => {
    setLoading(true);
    const fetchUserAndUserPostsFirestore = async () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, `Users/${route.params.userId}`);
        const userDocSnapshot = await getDoc(userDocRef);
        setUser(userDocSnapshot.data());

        const userPostsCollection = collection(
          FIRESTORE_DB,
          `Posts/${route.params.userId}/UserPosts`
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

  const toggleFollow = async () => {};
  return (
    <View>
      <SafeAreaView>
        <View>
          <Text>{user?.name}</Text>
          <Button title="Follow" onPress={toggleFollow} />
          <Button title="Unfollow" onPress={toggleFollow} />
          <FlatList
            numColumns={3}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate("ViewPost")}>
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

export default ViewProfileScreen;
