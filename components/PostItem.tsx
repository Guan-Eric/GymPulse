import React from "react";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { CheckBox, Icon } from "@rneui/themed";
import { ScreenWidth } from "@rneui/base";
import { router } from "expo-router";

const PostItem = ({
  post,
  theme,
  navigateProfile,
  onToggleLike,
  renderComments,
  showCommentIcon,
  showUser,
  tab,
}) => {
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
          <Text style={[styles.userName, { color: theme.colors.black }]}>
            {post.userName}
          </Text>
        </Pressable>
      ) : null}
      <Pressable
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
        <Text>{post.title}</Text>
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
            style={{ paddingRight: 30 }}
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
      <Text style={[styles.caption, { color: theme.colors.black }]}>
        {post.caption}
      </Text>
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
  caption: {
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
  },
});

export default PostItem;
