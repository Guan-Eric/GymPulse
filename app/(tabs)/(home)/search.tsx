import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Text } from "react-native";
import { SearchBar, useTheme } from "@rneui/themed";
import { query, collection, where, limit, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

function SearchScreen() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { theme } = useTheme();

  async function searchUser(searchText: string) {
    console.log(searchText);
    if (searchText === "") {
      setResults([]);
      return;
    }

    try {
      const usersQuery = query(
        collection(FIRESTORE_DB, "users"),
        where("name", ">=", searchText),
        where("name", "<=", searchText + "\uf8ff"),
        limit(5)
      );

      const querySnapshot = await getDocs(usersQuery);

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(users);
    } catch (error) {
      console.error("Error searching users: ", error);
    }
  }

  useEffect(() => {
    searchUser(search);
  }, [search]);

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
      }}
    >
      <Text style={{ color: theme.colors.black }}>{item.name}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <SearchBar
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
  );
}

export default SearchScreen;
