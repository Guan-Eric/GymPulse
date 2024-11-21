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
  showUser,
  tab,
}) => {
  const formattedDate = format(
    post?.date.toDate(),
    "MMMM do, yyyy 'at' h:mm a"
  );
  const backgroundColor = renderComments ? "#181818" : "#282828";
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
    <View style={{ backgroundColor: backgroundColor }}>
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
              <Text style={[styles.workoutText, { color: "gray" }]}>
                {formattedDate}
              </Text>
            </View>
          </View>
          <Button
            type="clear"
            onPress={() =>
              router.push({
                pathname: `(tabs)/${tab}/workout` as `/workout`,
                params: {
                  workoutId: post.workoutId,
                },
              })
            }
          >
            <Icon size={28} name="weight-lifter" type="material-community" />
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
                pathname: `(tabs)/${tab}/workout` as `/workout`,
                params: {
                  workoutId: post.workoutId,
                },
              })
            }
          >
            <Icon size={28} name="weight-lifter" type="material-community" />
          </Button>
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
        {post.title ? (
          <Text style={[styles.title, { color: theme.colors.black }]}>
            {post.title}
          </Text>
        ) : null}
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
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button disabled={!showUser} type="clear" onPress={onToggleLike}>
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
      {!renderComments && (
        <View style={{ height: 10, backgroundColor: "#1B1B1B" }}></View>
      )}
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
    fontFamily: "Alata_400Regular",
    fontSize: 12,
    paddingLeft: 5,
  },
  caption: {
    fontFamily: "Alata_400Regular",
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
