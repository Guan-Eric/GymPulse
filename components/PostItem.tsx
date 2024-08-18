import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { Avatar, Button, CheckBox, Icon } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { Href, router } from "expo-router";
import TruncatedText from "./TruncatedText";
import { format } from "date-fns";
import { getUser } from "../backend/user";
import { User } from "./types";
import Carousel from "react-native-reanimated-carousel";
import ImageCarousel from "./ImageCarousel";

const PostItem = ({
  post,
  theme,
  navigateProfile,
  onToggleLike,
  renderComments,
  showCommentIcon,
  showUser,
  tab,
  viewPost,
}) => {
  const formattedDate = format(
    new Date(post.date),
    "MMMM do, yyyy 'at' h:mm a"
  );

  const [user, setUser] = useState<User>();
  const [activeIndex, setActiveIndex] = useState(0);

  async function fetchUser(userId: string) {
    const fetchedUser = await getUser(post.userId);
    setUser(fetchedUser);
  }

  useEffect(() => {
    fetchUser(post.userId);
  }, []);

  return (
    <View style={{ paddingBottom: 20 }}>
      {showUser ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
            paddingLeft: 20,
          }}
        >
          <Pressable onPress={() => navigateProfile(post.userId)}>
            <Avatar rounded size={40} source={{ uri: user?.url }} />
          </Pressable>
          <View style={{ flexDirection: "column" }}>
            <Pressable onPress={() => navigateProfile(post.userId)}>
              <Text style={[styles.userName, { color: theme.colors.black }]}>
                {user?.username}
              </Text>
            </Pressable>
            <Text style={[styles.workoutText, { color: "gray" }]}>
              did a workout on {formattedDate}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "(tabs)/" + tab + "/workout",
                params: {
                  workoutId: post.workoutId,
                },
              } as Href<string>)
            }
          >
            <Icon
              style={{ paddingLeft: 15 }}
              size={28}
              name="clipboard-list-outline"
              type="material-community"
            />
          </Pressable>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            alignItems: "center",
            paddingLeft: 20,
          }}
        >
          <Text style={[styles.workoutText, { color: "gray" }]}>
            {formattedDate}
          </Text>
          <Button
            onPress={() =>
              router.push({
                pathname: "(tabs)/" + tab + "/workout",
                params: {
                  workoutId: post.workoutId,
                },
              } as Href<string>)
            }
          >
            <Icon
              style={{ paddingHorizontal: 15 }}
              size={32}
              name="clipboard-list-outline"
              type="material-community"
            />
          </Button>
        </View>
      )}
      <Pressable
        onPress={
          !viewPost
            ? () =>
                router.push({
                  pathname: "/(tabs)/" + tab + "/post",
                  params: {
                    postId: post.id,
                    userId: post.userId,
                  },
                } as Href<string>)
            : null
        }
      >
        <Text>{post.title}</Text>
        {post.caption ? (
          <TruncatedText theme={theme}>{post.caption}</TruncatedText>
        ) : null}
        <ImageCarousel data={post.urls} theme={theme} />
      </Pressable>
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 25,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CheckBox
          title={post.numLikes.toString()}
          checked={post.like}
          checkedIcon={
            <Icon
              size={28}
              name="arm-flex"
              type="material-community"
              color="#ffde34"
            />
          }
          uncheckedIcon={
            <Icon size={28} name="arm-flex-outline" type="material-community" />
          }
          onPress={onToggleLike}
        />
        {showCommentIcon && (
          <Pressable
            style={{ paddingRight: 10 }}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/" + tab + "/post",
                params: {
                  postId: post.id,
                  userId: post.userId,
                },
              } as Href<string>)
            }
          >
            <Icon name="comment-outline" type="material-community" />
          </Pressable>
        )}
      </View>

      {renderComments && renderComments()}
    </View>
  );
};

const styles = StyleSheet.create({
  userName: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
    paddingLeft: 10,
  },
  workoutText: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    paddingLeft: 10,
  },
  caption: {
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    fontSize: 14,
  },
});

export default PostItem;
