// app/(tabs)/(skills)/[skillId]/train.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Progression, SessionSet } from "../../../../components/types";
import {
  getProgression,
  saveTrainingSession,
} from "../../../../backend/skills";
import { FIREBASE_AUTH } from "../../../../firebaseConfig";

export default function TrainScreen() {
  const { skillId, progressionId } = useLocalSearchParams();
  const [progression, setProgression] = useState<Progression | null>(null);
  const [sets, setSets] = useState<SessionSet[]>([]);
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [notes, setNotes] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchProgression();
  }, [progressionId]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (isResting) {
              setIsResting(false);
              setCurrentSet((prev) => prev + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer, isResting]);

  const fetchProgression = async () => {
    try {
      const prog = await getProgression(progressionId as string);
      setProgression(prog);
    } catch (error) {
      console.error("Error fetching progression:", error);
    }
  };

  const startSet = () => {
    setTimer(0);
    // Start counting up for holds
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const endSet = (holdTime?: number, reps?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const newSet: SessionSet = {
      setNumber: currentSet + 1,
      holdTime: holdTime || timer,
      reps: reps,
      restTime: 60, // Default 60s rest
      completedAt: new Date(),
    };

    setSets([...sets, newSet]);
    setTimer(60); // Start rest timer
    setIsResting(true);
  };

  const skipRest = () => {
    setIsResting(false);
    setTimer(0);
    setCurrentSet((prev) => prev + 1);
  };

  const finishSession = async () => {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

    try {
      await saveTrainingSession({
        userId: FIREBASE_AUTH.currentUser?.uid,
        skillId: skillId as string,
        progressionId: progressionId as string,
        sets,
        duration: sessionDuration,
        notes,
        date: new Date(),
      });

      router.back();
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  if (!progression) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isHoldProgression = !!progression.targetHoldTime;
  const targetSets = progression.targetSets || 3;

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 py-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center mb-4"
          >
            <Text className="text-primary text-2xl">←</Text>
          </Pressable>

          <Text className="text-white text-2xl font-bold mb-1">
            {progression.name}
          </Text>
          <Text className="text-gray-400 text-sm">
            Set {currentSet + 1} of {targetSets}
          </Text>
        </View>

        {/* Form cues */}
        {progression.cues && progression.cues.length > 0 && (
          <View className="mx-5 mb-4 bg-dark-card rounded-2xl p-4">
            <Text className="text-gray-300 text-sm font-semibold mb-2">
              Form Cues:
            </Text>
            {progression.cues.map((cue, i) => (
              <Text key={i} className="text-gray-400 text-sm mb-1">
                • {cue}
              </Text>
            ))}
          </View>
        )}

        {/* Timer display */}
        <View className="items-center justify-center py-8">
          {isResting ? (
            <View className="items-center">
              <Text className="text-gray-400 text-lg mb-2">Rest Time</Text>
              <Text className="text-white text-7xl font-bold mb-4">
                {timer}
              </Text>
              <Pressable
                onPress={skipRest}
                className="bg-dark-card rounded-xl px-6 py-3"
              >
                <Text className="text-primary font-semibold">Skip Rest</Text>
              </Pressable>
            </View>
          ) : timer > 0 ? (
            <View className="items-center">
              <Text className="text-gray-400 text-lg mb-2">
                {isHoldProgression ? "Hold Time" : "Set Time"}
              </Text>
              <Text className="text-primary text-7xl font-bold mb-4">
                {timer}
              </Text>
              <Pressable
                onPress={() => endSet()}
                className="bg-primary rounded-xl px-6 py-3"
              >
                <Text className="text-white font-semibold">End Set</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={startSet}
              className="bg-primary rounded-3xl w-40 h-40 items-center justify-center"
            >
              <Text className="text-white text-2xl font-bold">START</Text>
            </Pressable>
          )}
        </View>

        {/* Target */}
        <View className="mx-5 mb-4">
          <View className="bg-dark-card rounded-2xl p-4">
            <Text className="text-gray-400 text-sm mb-2">Target</Text>
            {isHoldProgression ? (
              <Text className="text-white text-xl font-bold">
                {progression.targetHoldTime}s hold × {targetSets} sets
              </Text>
            ) : (
              <Text className="text-white text-xl font-bold">
                {progression.targetReps} reps × {targetSets} sets
              </Text>
            )}
          </View>
        </View>

        {/* Completed sets */}
        {sets.length > 0 && (
          <View className="mx-5 mb-4">
            <Text className="text-gray-300 text-sm font-semibold mb-3">
              Completed Sets:
            </Text>
            {sets.map((set, i) => (
              <View
                key={i}
                className="bg-dark-card rounded-xl p-3 mb-2 flex-row justify-between items-center"
              >
                <Text className="text-white font-semibold">
                  Set {set.setNumber}
                </Text>
                <Text className="text-primary font-bold">
                  {set.holdTime ? `${set.holdTime}s` : `${set.reps} reps`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        <View className="mx-5 mb-6">
          <Text className="text-gray-300 text-sm font-semibold mb-2">
            Notes (optional)
          </Text>
          <TextInput
            className="bg-dark-card rounded-xl p-4 text-white min-h-24"
            placeholder="How did it feel? Any observations?"
            placeholderTextColor="#6b7280"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Finish button */}
        {sets.length >= targetSets && (
          <View className="mx-5 mb-8">
            <Pressable
              onPress={finishSession}
              className="bg-green-600 rounded-xl py-4 items-center"
            >
              <Text className="text-white text-lg font-bold">
                Finish Session
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
