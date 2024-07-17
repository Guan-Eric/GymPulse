import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Button, SafeAreaView } from "react-native";
import { format } from "date-fns";
import {
  answerFollowRequest,
  getFollowRequests,
  getNotifications,
} from "../../../backend/user";
import { useTheme } from "@rneui/themed";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);
  const { theme } = useTheme();

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

  const handleFollowRequest = (userId: string, accepted: boolean) => {
    answerFollowRequest(userId, accepted);
    setFollowRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== userId)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Text style={{ color: theme.colors.black }}>Follow Requests</Text>
        {followRequests.length > 0 ? (
          <FlatList
            data={followRequests}
            renderItem={({ item }) => (
              <View>
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
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}
        <Text style={{ color: theme.colors.black }}>Notifications</Text>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: theme.colors.black }}>
                  {item.username}
                </Text>
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
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </SafeAreaView>
    </View>
  );
};

export default NotificationsScreen;
