import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Button,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { format } from "date-fns";
import {
  answerFollowRequest,
  getFollowRequests,
  getNotifications,
} from "../../../backend/user";
import { Tab, TabView, useTheme } from "@rneui/themed";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();

  const fetchFollowRequests = async () => {
    const requests = await getFollowRequests();
    setFollowRequests(requests);
  };

  const fetchNotifications = async () => {
    const notifs = await getNotifications();
    setNotifications(notifs);
  };

  useEffect(() => {
    fetchNotifications();
    fetchFollowRequests();
  }, []);

  const handleFollowRequest = (userId, accepted) => {
    answerFollowRequest(userId, accepted);
    setFollowRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== userId)
    );
  };

  const renderFollowRequest = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={{ color: theme.colors.black }}>
        {item.username} sent you a follow request
      </Text>
      <Button
        title="Accept"
        onPress={() => handleFollowRequest(item.id, true)}
      />
      <Button
        title="Reject"
        onPress={() => handleFollowRequest(item.id, false)}
      />
    </View>
  );

  const renderNotification = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={{ color: theme.colors.black }}>{item.username}</Text>
      <Text style={{ color: theme.colors.black }}>
        {item.type === "like"
          ? " liked your post"
          : item.type === "comment"
          ? " commented on your post"
          : " has a new post"}
      </Text>
      <Text style={{ color: theme.colors.black }}>
        {format(new Date(item.date), "MMMM do, yyyy 'at' h:mm a")}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: theme.colors.black,
          }}
        >
          <Tab.Item
            title="Notifications"
            titleStyle={{ fontSize: 18, color: theme.colors.black }}
          />
          <Tab.Item
            title="Follow Requests"
            titleStyle={{ fontSize: 18, color: theme.colors.black }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex}>
          <TabView.Item style={styles.tabViewItem}>
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <Text style={{ color: theme.colors.black }}>
                  No notifications
                </Text>
              )}
            />
          </TabView.Item>
          <TabView.Item style={styles.tabViewItem}>
            <FlatList
              data={followRequests}
              renderItem={renderFollowRequest}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <Text style={{ color: theme.colors.black }}>
                  No follow requests
                </Text>
              )}
            />
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabViewItem: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default NotificationsScreen;
