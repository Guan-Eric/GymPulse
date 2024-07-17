import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Button } from "react-native";
import { format } from "date-fns";
import {
  getFollowRequests,
  getNotifications,
  getUser,
  handleFollowRequest,
} from "../../../backend/user";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);

  const fetchFollowRequests = async () => {
    setFollowRequests(await getFollowRequests());
  };
  const fetchNotifications = async () => {
    setNotifications(await getNotifications());
  };

  useEffect(() => {
    fetchNotifications();
    fetchFollowRequests();
  }, []);

  return (
    <View>
      <Text>Follow Requests</Text>
      <FlatList
        data={followRequests}
        renderItem={({ item }) => (
          <View>
            <Text>{item.username} sent you a follow request</Text>
            <Button
              title="Accept"
              onPress={() => handleFollowRequest(item.id, true)}
            />
            <Button
              title="Reject"
              onPress={() => handleFollowRequest(item.id, false)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View>
            <Text>{item.username}</Text>
            <Text>
              {item.type === "like"
                ? "liked your post"
                : item.type === "comment"
                ? "commented on your post"
                : "has a new post"}
            </Text>
            <Text>
              {format(new Date(item.date), "MMMM do, yyyy 'at' h:mm a")}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default NotificationsScreen;
