import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Button, CheckBox } from "@rneui/themed";

const TermsConditionModal = ({ modalVisible, onClose, theme }) => {
  const [isCheck, setIsCheck] = useState(false);

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
              End User License Agreement (EULA) and Terms of Service
            </Text>
            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              1. Acceptance of Terms
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              By downloading, accessing, or using the App, you confirm that you
              have read, understood, and agree to this Agreement. If you are
              under 18 years of age, you may only use the App with the consent
              of a parent or legal guardian.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              2. Prohibited Activities
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              The following activities are strictly prohibited within the App: -
              Posting, sharing, or transmitting any content that is abusive,
              defamatory, hateful, obscene, or otherwise objectionable. -
              Harassing, threatening, or impersonating other users.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              3. Content Moderation
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              All user-generated content ("UGC") will be monitored for
              compliance with this Agreement. The Company reserves the right to
              review, edit, or remove any UGC that violates these terms without
              prior notice. The Company is not liable for any user-generated
              content but will act promptly to address flagged issues.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              4. User Responsibility
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              Users are solely responsible for the content they post, share, or
              interact with on the App. Users agree not to misuse any reporting
              mechanisms or falsely flag content.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              5. Flagging Objectionable Content
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              The App provides a mechanism for users to report objectionable
              content. To report content: 1. Tap the "Report" button on the
              offending content. 2. Select a reason for reporting. 3. Submit the
              report for review. All reports will be reviewed by the Company
              within 48 hours, and appropriate actions will be taken.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              6. Blocking Abusive Users
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              Users can block other users within the App by following these
              steps: 1. Visit the profile or interaction of the user you want to
              block. 2. Tap the "Block" button. 3. Confirm the block action.
              Blocked users will no longer be able to interact with or view your
              content within the App.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              7. Termination
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              The Company reserves the right to suspend or terminate your access
              to the App if you violate this Agreement or engage in any
              prohibited activities.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              8. Privacy Policy
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              Your use of the App is subject to the Company's Privacy Policy,
              which is incorporated into this Agreement. By using the App, you
              consent to the data practices described in the Privacy Policy.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              9. Disclaimer of Warranties
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              The App is provided "as is" without any warranties of any kind,
              whether express or implied. The Company does not guarantee the
              accuracy, reliability, or availability of the App or its content.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              10. Limitation of Liability
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              The Company shall not be liable for any damages arising from your
              use of the App or inability to use the App.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              11. Governing Law
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              This Agreement shall be governed by and construed in accordance
              with the laws of Canada.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              12. Contact Information
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.black }]}>
              If you have any questions or concerns regarding this Agreement,
              please contact us at: gympulsecontact@gmail.com
            </Text>
            <CheckBox
              checked={isCheck}
              containerStyle={styles.checkboxContainer}
              onPress={() => setIsCheck(!isCheck)}
              checkedTitle="I declare that I have read the EULA and Terms of Service"
            />
            <Button
              disabled={!isCheck}
              buttonStyle={styles.closeButton}
              onPress={onClose}
            ></Button>
          </ScrollView>
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
    width: 300,
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  checkboxContainer: {
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TermsConditionModal;
