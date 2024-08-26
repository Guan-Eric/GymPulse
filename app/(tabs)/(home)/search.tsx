import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Avatar, SearchBar, useTheme } from "@rneui/themed";
import { query, collection, where, limit, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { router } from "expo-router";

function SearchScreen() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { theme } = useTheme();

  async function searchUser(searchText: string) {
    if (searchText === "") {
      setResults([]);
      return;
    }

    try {
      const usersQuery = query(
        collection(FIRESTORE_DB, "Users"),
        where("prefixes", "array-contains", searchText.toLowerCase()),
        limit(10)
      );

      const querySnapshot = await getDocs(usersQuery);

      const users = querySnapshot.docs.map((doc) => doc.data());
      setResults(users);
    } catch (error) {
      console.error("Error searching users: ", error);
    }
  }

  const navigateProfile = (userId) => {
    if (userId === FIREBASE_AUTH.currentUser?.uid) {
      router.push("/(tabs)/(profile)/user");
    } else {
      router.push({
        pathname: "/(tabs)/(home)/profile",
        params: { userId: userId },
      });
    }
  };

  useEffect(() => {
    searchUser(search);
  }, [search]);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigateProfile(item.id)}
      style={{
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar rounded source={{ uri: item.url }} />
        <Text style={{ color: theme.colors.black, paddingLeft: 10 }}>
          {item.username}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <SafeAreaView>
          <SearchBar
            containerStyle={{
              backgroundColor: theme.colors.background,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputContainerStyle={{
              borderRadius: 10,
            }}
            placeholder="Type Here..."
            onChangeText={(text) => setSearch(text)}
            onClear={() => setSearch("")}
            value={search}
          />
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SearchScreen;
