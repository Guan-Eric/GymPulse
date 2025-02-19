import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "@rneui/themed";

const AnalysisModal = ({ modalVisible, onClose, theme, answer }) => {
  const formatAnswer = (answer) => {
    const sections = answer.split("###");
    return sections.map((section, index) => {
      if (section.trim() === "") return null;

      const [heading, ...content] = section.split("\n");
      const formattedContent = content.map((line, i) => {
        if (line.trim().startsWith("-")) {
          return (
            <Text
              key={i}
              style={[styles.listItem, { color: theme.colors.black }]}
            >
              • {formatBoldText(line.trim().substring(1).trim())}
            </Text>
          );
        } else {
          return (
            <Text
              key={i}
              style={[styles.paragraph, { color: theme.colors.black }]}
            >
              {formatBoldText(line.trim())}
            </Text>
          );
        }
      });

      return (
        <View key={index} style={styles.section}>
          {heading && (
            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              {formatBoldText(heading.trim())}
            </Text>
          )}
          {formattedContent}
        </View>
      );
    });
  };

  const formatBoldText = (text) => {
    const parts = text.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <Text key={i} style={{ fontWeight: "bold" }}>
            {part}
          </Text>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.grey0 },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.title, { color: theme.colors.black }]}>
              Analysis
            </Text>
            {formatAnswer(answer)}
          </ScrollView>
          <Button
            buttonStyle={styles.closeButton}
            onPress={onClose}
            title="Close"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "86%",
    height: "80%",
    borderRadius: 20,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
    marginTop: 5,
  },
  closeButton: {
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default AnalysisModal;
