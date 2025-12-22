// app/(tabs)/(skills)/[skillId]/progression.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Skill, Progression, UserProgress } from "../../../../components/types";
import { getSkill, getUserSkillProgress } from "../../../../backend/skills";
import { FIREBASE_AUTH } from "../../../../firebaseConfig";

export default function ProgressionScreen() {
  const { skillId } = useLocalSearchParams();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [skillId]);

  const fetchData = async () => {
    try {
      const [skillData, progressData] = await Promise.all([
        getSkill(skillId as string),
        getUserSkillProgress(FIREBASE_AUTH.currentUser?.uid, skillId as string),
      ]);
      setSkill(skillData);
      setUserProgress(progressData);
    } catch (error) {
      console.error("Error fetching progression:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressionStatus = (
    progression: Progression
  ): "completed" | "current" | "locked" => {
    if (!userProgress) return "locked";

    const currentIndex = skill.progressions.findIndex(
      (p) => p.id === userProgress.currentProgressionId
    );
    const thisIndex = skill.progressions.findIndex(
      (p) => p.id === progression.id
    );

    if (thisIndex < currentIndex) return "completed";
    if (thisIndex === currentIndex) return "current";
    return "locked";
  };

  const canStartProgression = (progression: Progression): boolean => {
    if (!progression.prerequisites?.length) return true;
    // Check if all prerequisites are completed
    return progression.prerequisites.every((preqId) => {
      const preqIndex = skill.progressions.findIndex((p) => p.id === preqId);
      const currentIndex = skill.progressions.findIndex(
        (p) => p.id === userProgress?.currentProgressionId
      );
      return preqIndex < currentIndex;
    });
  };

  const renderProgression = (progression: Progression, index: number) => {
    const status = getProgressionStatus(progression);
    const canStart = canStartProgression(progression);

    const bgColor =
      status === "completed"
        ? "bg-green-900/30"
        : status === "current"
        ? "bg-primary/30"
        : "bg-dark-card";

    const borderColor =
      status === "completed"
        ? "border-green-500"
        : status === "current"
        ? "border-primary"
        : "border-dark-border";

    return (
      <View key={progression.id} className="mb-4">
        {/* Connection line */}
        {index > 0 && <View className="h-8 w-0.5 bg-dark-border ml-6 -mb-4" />}

        <Pressable
          onPress={() => {
            if (status === "current" || (status === "locked" && canStart)) {
              router.push({
                pathname: "/(tabs)/(skills)/[skillId]/train",
                params: {
                  skillId: skillId as string,
                  progressionId: progression.id,
                },
              });
            }
          }}
          disabled={status === "completed"}
          className={`${bgColor} ${borderColor} border-2 rounded-2xl p-4 mx-4`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                {/* Status indicator */}
                <View
                  className={`w-3 h-3 rounded-full mr-3 ${
                    status === "completed"
                      ? "bg-green-500"
                      : status === "current"
                      ? "bg-primary"
                      : "bg-gray-600"
                  }`}
                />

                <Text className="text-white text-lg font-bold flex-1">
                  {progression.name}
                </Text>

                <Text className="text-gray-400 text-sm">
                  Level {progression.level}
                </Text>
              </View>

              <Text className="text-gray-400 text-sm mb-3 ml-6">
                {progression.description}
              </Text>

              {/* Target metrics */}
              <View className="flex-row ml-6 mb-2">
                {progression.targetHoldTime && (
                  <View className="bg-dark-bg rounded-lg px-3 py-1 mr-2">
                    <Text className="text-gray-300 text-xs">
                      Hold: {progression.targetHoldTime}s
                    </Text>
                  </View>
                )}
                {progression.targetReps && (
                  <View className="bg-dark-bg rounded-lg px-3 py-1 mr-2">
                    <Text className="text-gray-300 text-xs">
                      {progression.targetReps} reps
                    </Text>
                  </View>
                )}
                {progression.targetSets && (
                  <View className="bg-dark-bg rounded-lg px-3 py-1">
                    <Text className="text-gray-300 text-xs">
                      {progression.targetSets} sets
                    </Text>
                  </View>
                )}
              </View>

              {/* Best performance */}
              {status === "current" && userProgress && (
                <View className="ml-6 mt-2">
                  <Text className="text-primary text-xs font-semibold">
                    Your best:{" "}
                    {userProgress.bestHoldTime || userProgress.bestReps || 0}
                    {progression.targetHoldTime ? "s" : " reps"}
                  </Text>
                </View>
              )}

              {/* Action button */}
              {status === "current" && (
                <View className="bg-primary rounded-xl py-2 px-4 mt-3 ml-6 self-start">
                  <Text className="text-white font-semibold">Train Now</Text>
                </View>
              )}

              {status === "locked" && !canStart && (
                <View className="ml-6 mt-2">
                  <Text className="text-gray-500 text-xs">
                    Complete prerequisites first
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Common mistakes collapse */}
          {status === "current" && progression.commonMistakes.length > 0 && (
            <View className="mt-3 pt-3 border-t border-dark-border">
              <Text className="text-gray-300 text-xs font-semibold mb-2">
                Common Mistakes:
              </Text>
              {progression.commonMistakes.map((mistake, i) => (
                <Text key={i} className="text-gray-400 text-xs ml-2 mb-1">
                  • {mistake}
                </Text>
              ))}
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!skill) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Skill not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView>
        {/* Header */}
        <View className="px-5 py-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center mb-4"
          >
            <Text className="text-primary text-2xl">←</Text>
          </Pressable>

          <Text className="text-white text-3xl font-bold mb-2">
            {skill.name}
          </Text>
          <Text className="text-gray-400 text-sm mb-4">
            {skill.description}
          </Text>

          {userProgress && (
            <View className="bg-dark-card rounded-2xl p-4">
              <Text className="text-gray-300 text-sm mb-2">Your Progress</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-lg font-bold">
                  Level{" "}
                  {skill.progressions.findIndex(
                    (p) => p.id === userProgress.currentProgressionId
                  ) + 1}
                </Text>
                <Text className="text-gray-400 text-sm">
                  of {skill.progressions.length}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Progression tree */}
        <View className="py-4">
          {skill.progressions.map((progression, index) =>
            renderProgression(progression, index)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
