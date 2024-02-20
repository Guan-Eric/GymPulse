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
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

function ProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 3;

  useEffect(() => {
    setLoading(true);
    const fetchUserAndUserPostsFirestore = async () => {
      try {
        const userDocRef = doc(
          FIRESTORE_DB,
          `Users/${FIREBASE_AUTH.currentUser.uid}`
        );
        const userDocSnapshot = await getDoc(userDocRef);
        setUser(userDocSnapshot.data());

        const userPostsCollection = collection(
          FIRESTORE_DB,
          `Posts/${FIREBASE_AUTH.currentUser.uid}/UserPosts`
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
    <View>
      <SafeAreaView>
        <Button
          title="Settings"
          onPress={() => navigation.navigate("Settings")}
        />
        <View>
          <Text>{user?.name}</Text>
          <FlatList
            numColumns={3}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <Pressable>
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

export default ProfileScreen;
