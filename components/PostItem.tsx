import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Image, Text, StyleSheet, Alert } from "react-native";
import { Avatar, Button, CheckBox, Icon } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { Href, router } from "expo-router";
import TruncatedText from "./TruncatedText";
import { format } from "date-fns";
import { getUser } from "../backend/user";
import { User } from "./types";
import Carousel from "react-native-reanimated-carousel";
import ImageCarousel from "./PostCarousel";
import ThreeDotsModal from "./modal/ThreeDotsModal";
import { reportPost } from "../backend/post";

const PostItem = ({
  post,
  theme,
  navigateProfile,
  onToggleLike,
  renderComments,
  showUser,
  tab,
}) => {
  const formattedDate = format(
    post?.date.toDate(),
    "MMMM do, yyyy 'at' h:mm a"
  );
  const [user, setUser] = useState<User>();

  console.log(post);
  async function fetchUser() {
    const fetchedUser = await getUser(post.userId);
    setUser(fetchedUser);
  }

  async function handleReportPost() {
    reportPost(post.id, post.userId);
    Alert.alert("Post Reported", "Thank you for reporting this post.");
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const postOptions = [
    {
      title: "View Workout",
      onPress: () => {
        router.push({
          pathname: `(tabs)/${tab}/workout` as `/workout`,
          params: {
            workoutId: post.workoutId,
            userId: post.userId,
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.primary },
    },
    {
      title: "Report",
      onPress: () => {
        handleReportPost();
      },
      containerStyle: { backgroundColor: theme.colors.error },
    },
    {
      title: "Cancel",
      onPress: () => {
        null;
      },
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
  ];

  const userPostOptions = [
    {
      title: "View Workout",
      onPress: () => {
        router.push({
          pathname: `(tabs)/${tab}/workout` as `/workout`,
          params: {
            workoutId: post.workoutId,
            userId: post.userId,
          },
        });
      },
      containerStyle: { backgroundColor: theme.colors.primary },
    },
    {
      title: "Cancel",
      onPress: () => {
        null;
      },
      containerStyle: { backgroundColor: theme.colors.grey1 },
    },
  ];

  return (
    <View
      style={{
        backgroundColor: theme.colors.grey0,
        paddingBottom: 5,
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 20,
      }}
    >
      {showUser ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 15,
            padding: 10,
          }}
        >
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Pressable onPress={() => navigateProfile(post.userId)}>
              <Avatar rounded size={40} source={{ uri: user?.url }} />
            </Pressable>
            <View style={{ flexDirection: "column" }}>
              <Pressable onPress={() => navigateProfile(post.userId)}>
                <Text style={[styles.userName, { color: theme.colors.black }]}>
                  {user?.username}
                </Text>
              </Pressable>
              <Text style={[styles.workoutText, { color: theme.colors.grey3 }]}>
                {formattedDate}
              </Text>
            </View>
          </View>
          <ThreeDotsModal options={postOptions} theme={theme} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 15,
            paddingRight: 10,
            paddingTop: 5,
          }}
        >
          <Text style={[styles.workoutText, { color: theme.colors.grey3 }]}>
            {formattedDate}
          </Text>
          <ThreeDotsModal options={userPostOptions} theme={theme} />
        </View>
      )}
      <Pressable
        onPress={
          !renderComments
            ? () =>
                router.push({
                  pathname: `/(tabs)/${tab}/post` as `/post`,
                  params: {
                    postId: post.id,
                    userId: post.userId,
                  },
                })
            : null
        }
      >
        {post?.title?.length > 0 ? (
          <Text style={[styles.title, { color: theme.colors.black }]}>
            {post.title}
          </Text>
        ) : null}
        {post?.caption?.length > 0 ? (
          <TruncatedText theme={theme}>{post.caption}</TruncatedText>
        ) : null}
        {post?.urls?.length > 0 ? (
          <ImageCarousel data={post.urls} theme={theme} />
        ) : null}
      </Pressable>
      <View
        style={{
          paddingLeft: ScreenWidth * 0.025,
          paddingRight: ScreenWidth * 0.04,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button disabled={!onToggleLike} type="clear" onPress={onToggleLike}>
            <Icon
              size={28}
              name={post.like ? "arm-flex" : "arm-flex"}
              type="material-community"
              color={post.like ? "#ffde34" : undefined}
            />
          </Button>
          <Text style={[styles.count, { color: theme.colors.black }]}>
            {post.numLikes}
          </Text>
        </View>
        {!renderComments && (
          <>
            <Button
              type="clear"
              onPress={() =>
                router.push({
                  pathname: `/(tabs)/${tab}/post` as `/post`,
                  params: {
                    postId: post.id,
                    userId: post.userId,
                  },
                })
              }
            >
              <Icon name="comment" type="material-community" />
            </Button>
            <Text style={[styles.count, { color: theme.colors.black }]}>
              {post.numComments > 0 && post.numComments}
            </Text>
          </>
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
  title: {
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 20,
    paddingBottom: 15,
  },
  workoutText: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    paddingLeft: 5,
  },
  caption: {
    fontFamily: "Lato_400Regular",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    fontSize: 14,
  },
  count: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
});

export default PostItem;
