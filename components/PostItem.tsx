import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { CheckBox, Icon } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { router } from "expo-router";
import TruncatedText from "./TruncatedText";
import { format } from "date-fns";

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
  return (
    <View style={{ paddingBottom: 20 }}>
      {showUser ? (
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
            paddingLeft: 30,
          }}
          onPress={() => navigateProfile(post.userId)}
        >
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../assets/profile.png")}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={[styles.userName, { color: theme.colors.black }]}>
              {post.userName}
            </Text>
            <Text style={[styles.workoutText, { color: "gray" }]}>
              did a workout on {formattedDate}
            </Text>
          </View>
        </Pressable>
      ) : null}
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
                })
            : null
        }
      >
        <Text>{post.title}</Text>
        <TruncatedText theme={theme}>{post.caption}</TruncatedText>
        <Image
          source={{ uri: post.url }}
          style={{
            alignSelf: "center",
            borderRadius: 15,
            width: 0.93 * ScreenWidth,
            height: 0.93 * ScreenWidth * 1.25,
            resizeMode: "cover",
          }}
        />
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
              })
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
