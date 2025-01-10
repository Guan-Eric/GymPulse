import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button, Icon } from "@rneui/themed";

interface CommentsSectionProps {
  comments: { userName: string; comment: string }[];
  comment: string;
  onCommentChange: (text: string) => void;
  onAddComment: () => void;
  theme;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  comment,
  onCommentChange,
  onAddComment,
  theme,
}) => {
  return (
    <View>
      {comments.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", paddingLeft: 15 }}>
          <Text style={[styles.commentUserName, { color: theme.colors.black }]}>
            {item.userName}
          </Text>
          <Text style={[styles.comment, { color: theme.colors.black }]}>
            {item.comment}
          </Text>
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 15,
          paddingRight: 25,
          paddingTop: 15,
        }}
      >
        <Input
          inputStyle={{ color: theme.colors.black }}
          containerStyle={{ width: 270 }}
          inputContainerStyle={{
            paddingLeft: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.greyOutline,
          }}
          onChangeText={onCommentChange}
          value={comment}
          placeholder="Comment here"
          autoCapitalize="none"
        />
        <Button
          disabled={comment === ""}
          disabledStyle={{ backgroundColor: theme.colors.grey1 }}
          buttonStyle={{ borderRadius: 10 }}
          onPress={onAddComment}
          icon={<Icon name="arrow-up" size={24} type="material-community" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    fontFamily: "Lato_400Regular",
    paddingLeft: 5,
    paddingRight: 25,
    fontSize: 16,
  },
  commentUserName: {
    fontFamily: "Lato_700Bold",
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default CommentsSection;
