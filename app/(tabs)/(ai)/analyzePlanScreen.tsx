import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Input, useTheme } from "@rneui/themed";
import { analysePlan } from "../../../backend/ai";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../../components/BackButton";
import SelectPlanCard from "../../../components/card/SelectPlanCard";
import { Plan } from "../../../components/types";
import { getPlans } from "../../../backend/plan";
import AnalysisModal from "../../../components/modal/AnalysisModal";

export default function AnalyzePlanScreen() {
  const [goal, setGoal] = useState<string>("");
  const [preference, setPreference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>(null);
  const [plan, setPlan] = useState<Plan>(null);
  const { theme } = useTheme();

  const handleAnalyzePlan = async () => {
    setLoading(true);
    try {
      const analysis = await analysePlan(goal, preference, plan.id);
      if (analysis) {
        setAnswer(analysis);
      } else {
        throw new Error("Invalid analysis");
      }
    } catch (error) {
      console.error("Error performing analysis:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(true);
    }
  };

  const fetchPlans = async () => {
    try {
      setPlans(await getPlans());
    } catch (error) {
      console.error("Error fetching plans", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BackButton />
              <Text style={[styles.title, { color: theme.colors.black }]}>
                Analysis
              </Text>
            </View>
            <SelectPlanCard
              plans={plans}
              theme={theme}
              setPlan={setPlan}
              plan={plan}
            />
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 0,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Enter your goal"
              placeholder="e.g weight loss, muscle gain"
              value={goal}
              onChangeText={setGoal}
            />

            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 15,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Other Preferences"
              placeholder="e.g. write current progress, preferences, etc..."
              value={preference}
              onChangeText={setPreference}
            />
            <Button
              titleStyle={styles.buttonTitle}
              disabled={plan && goal && !loading ? false : true}
              buttonStyle={{
                marginTop: 10,
                backgroundColor: theme.colors.primary,
                width: 200,
                borderRadius: 20,
                alignSelf: "center",
              }}
              title="Generate Plan"
              onPress={handleAnalyzePlan}
              loading={loading}
              containerStyle={styles.buttonContainer}
            />
          </ScrollView>
          <AnalysisModal
            modalVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            theme={theme}
            answer={answer}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Lato_700Bold",
    paddingLeft: 20,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  planContainer: {
    marginTop: 30,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    height: 42,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    color: "white",
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
  inputRoundedContainer: {
    marginTop: 2,
    paddingLeft: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  checkboxContainer: {
    width: "35%",
  },
  buttonContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  buttonTitle: {
    fontFamily: "Lato_700Bold",
  },
});
