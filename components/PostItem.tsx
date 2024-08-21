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
import ImageCarousel from "./PostCarousel";

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
            justifyContent: "space-between",
            paddingRight: 10,
            paddingLeft: 15,
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
          <Button
            type="clear"
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
              size={28}
              name="clipboard-list-outline"
              type="material-community"
            />
          </Button>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            paddingLeft: 15,
            paddingRight: 10,
          }}
        >
          <Text style={[styles.workoutText, { color: "gray" }]}>
            {formattedDate}
          </Text>
          <Button
            type="clear"
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
              size={28}
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
          paddingLeft: ScreenWidth * 0.025,
          paddingRight: ScreenWidth * 0.04,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            type="clear"
            onPress={onToggleLike}
            icon={
              <Icon
                size={28}
                name={post.like ? "arm-flex" : "arm-flex-outline"}
                type="material-community"
                color={post.like ? "#ffde34" : undefined}
              />
            }
          />
          <Text
            style={[
              styles.likeCount,
              { fontSize: 16, color: theme.colors.black },
            ]}
          >
            {post.numLikes}
          </Text>
        </View>
        {showCommentIcon && (
          <Button
            type="clear"
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
          </Button>
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
    paddingLeft: 5,
  },
  workoutText: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    paddingLeft: 5,
  },
  caption: {
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    fontSize: 14,
  },
  likeCount: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
});

export default PostItem;
