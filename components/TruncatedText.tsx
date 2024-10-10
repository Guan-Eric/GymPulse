import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

const TruncatedText = ({ theme, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    if (textHeight > containerHeight + 5) {
      setShowReadMore(true);
    } else {
      setShowReadMore(false);
    }
  }, [textHeight, containerHeight]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <Text
        style={[styles.caption, { color: theme.colors.black }]}
        numberOfLines={isExpanded ? undefined : 3}
        ellipsizeMode="tail"
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setContainerHeight(height);
        }}
      >
        {children}
      </Text>
      <Text
        style={[styles.caption, styles.measurementText]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setTextHeight(height);
        }}
      >
        {children}
      </Text>
      {showReadMore && (
        <Pressable onPress={toggleExpansion}>
          <Text style={[styles.caption, { color: "gray" }]}>
            {isExpanded ? "Read Less" : "Read More"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  caption: {
    textAlign: "justify",
    fontFamily: "Alata_400Regular",
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 15,
    fontSize: 14,
  },
  measurementText: {
    position: "absolute",
    opacity: 0,
    fontSize: 16,
  },
});

export default TruncatedText;
