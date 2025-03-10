import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { Icon, useTheme, Button, useThemeMode } from "@rneui/themed";
import { getFeed, toggleLike } from "../../../backend/post";
import PostItem from "../../../components/PostItem";
import { Post } from "../../../components/types";
import { router, useFocusEffect } from "expo-router";
import { usePushNotifications } from "../../../components/usePushNotifications";
import {
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import {
  endStreak,
  getUser,
  savePushToken,
  updateStreakResetDate,
  updateTermsCondition,
} from "../../../backend/user";
import FeedLoader from "../../../components/loader/FeedLoader";
import StreakResetModal from "../../../components/modal/StreakLossModal";
import { isAfter } from "date-fns";
import {
  deleteDoc,
  getDocs,
  Timestamp,
  where,
  collection,
  query,
} from "firebase/firestore";
import Constants from "expo-constants";
import TermsConditionModal from "../../../components/modal/TermsConditionModal";
import StreakModal from "../../../components/modal/StreakModal";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [streakResetModalVisible, setStreakResetModalVisible] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [termsCondition, setTermsCondition] = useState(false);
  const [longestStreak, setLongestStreak] = useState(0);
  const [offerings, setOfferings] = useState(null);

  const {
    expoPushToken,
    notification,
    hasNewNotification,
    markNotificationsAsRead,
  } = usePushNotifications();
  const AD_POSITION_INTERVAL = 5;

  async function fetchFeed() {
    try {
      setPosts(await getFeed());
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function initializeTheme() {
    const themeMode = (await getUser(FIREBASE_AUTH.currentUser.uid)).darkMode
      ? "dark"
      : "light";
    setMode(themeMode);
  }

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOfferings = offerings?.current;
      console.log(currentOfferings);
      if (currentOfferings) setOfferings(currentOfferings);
    } catch (error) {
      console.error("Error fetching offerings:", error);
    }
  };

  const initializeRC = async () => {
    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenueCatApiKey,
        appUserID: FIREBASE_AUTH.currentUser?.uid,
      });
    } else {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenueCatApiKey, // TODO: change to android variable
        appUserID: FIREBASE_AUTH.currentUser?.uid,
      });
    }
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    await fetchOfferings();
  };

  useEffect(() => {
    initializeRC();
    initializeTheme();
    fetchFeed();
    fetchOfferings();
    checkStreakStatus();
    getStreakInformation();
    getTermsCondition();
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      savePushToken(expoPushToken.data);
    }
  }, [expoPushToken]);

  useFocusEffect(
    useCallback(() => {
      initializeTheme();
      fetchFeed();
      getStreakInformation();
    }, [])
  );

  const navigateProfile = (id: string) => {
    if (id === FIREBASE_AUTH.currentUser?.uid) {
      router.push("/(tabs)/(profile)/user");
    } else {
      router.push({
        pathname: "/(tabs)/(home)/profile",
        params: { userId: id },
      });
    }
  };

  const handleToggleLike = async (post: Post) => {
    const updatedPost = await toggleLike(post);
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const navigateToNotifications = () => {
    markNotificationsAsRead();
    router.push({
      pathname: "/(tabs)/(home)/notification",
    });
  };

  const checkStreakStatus = async () => {
    const resetDate = (await getUser(FIREBASE_AUTH.currentUser.uid))
      .streakResetDate;
    if (resetDate instanceof Timestamp) {
      const currentDate = new Date();
      const resetDateAsDate = resetDate.toDate();
      const currentStreak = (await getUser(FIREBASE_AUTH.currentUser.uid))
        .currentStreak;
      if (isAfter(currentDate, resetDateAsDate) && currentStreak > 0) {
        setStreakResetModalVisible(true);
      }
    }
  };

  const getStreakInformation = async () => {
    setCurrentStreak(
      (await getUser(FIREBASE_AUTH.currentUser.uid)).currentStreak
    );
    setLongestStreak(
      (await getUser(FIREBASE_AUTH.currentUser.uid)).longestStreak
    );
  };

  const getTermsCondition = async () => {
    setTermsCondition(
      (await getUser(FIREBASE_AUTH.currentUser.uid)).showTermsCondition
    );
  };

  const handleContinueStreak = () => {
    updateStreakResetDate();
    setStreakResetModalVisible(false);
  };

  const handleNewStreak = () => {
    endStreak();
    setCurrentStreak(0);
    setStreakResetModalVisible(false);
  };

  const handleTermsCondition = () => {
    updateTermsCondition();
    setTermsCondition(false);
  };

  const renderItem = ({ item, index }) => {
    if ((index + 1) % AD_POSITION_INTERVAL === 0) {
      return (
        <View>
          {/*style={{ marginVertical: 10 }}>
           <AdMobBanner
            bannerSize="mediumRectangle"
            adUnitID={
              Platform.OS === "ios"
                ? Constants.expoConfig?.extra?.admobIOSFeedUnitId
                : Constants.expoConfig?.extra?.admobAndroidFeedUnitId
            }
            onDidFailToReceiveAdWithError={(error) => console.error(error)}
          /> */}
        </View>
      );
    }
    return (
      <PostItem
        post={item}
        theme={theme}
        navigateProfile={navigateProfile}
        onToggleLike={() => handleToggleLike(item)}
        renderComments={false}
        showUser={true}
        tab="(home)"
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        marginBottom: Platform.OS == "ios" ? -35 : 0,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            paddingLeft: 25,
            paddingRight: 10,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Feed
          </Text>
          <View style={{ flexDirection: "row" }}>
            <StreakModal
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              theme={theme}
            />
            <Button type="clear" onPress={navigateToNotifications}>
              {hasNewNotification ? (
                <Icon size={32} name="bell-badge" type="material-community" />
              ) : (
                <Icon size={32} name="bell" type="material-community" />
              )}
            </Button>
            <Button
              type="clear"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(home)/search",
                })
              }
            >
              <Icon size={32} name="magnify" type="material-community" />
            </Button>
          </View>
        </View>
        {loading ? (
          <View style={{ alignItems: "center" }}>
            <FeedLoader theme={theme} />
            <FeedLoader theme={theme} />
          </View>
        ) : posts?.length > 0 ? (
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={renderItem}
          />
        ) : (
          <View style={{ alignItems: "center", paddingTop: 100 }}>
            <Text style={[styles.message, { color: theme.colors.black }]}>
              No posts...
            </Text>
          </View>
        )}
        <StreakResetModal
          modalVisible={streakResetModalVisible}
          onClose={() => setStreakResetModalVisible(false)}
          onContinueStreak={handleContinueStreak}
          option={offerings?.save_streak}
          onNewStreak={handleNewStreak}
          theme={theme}
        />
        <TermsConditionModal
          modalVisible={termsCondition}
          onClose={handleTermsCondition}
          theme={theme}
        />
      </SafeAreaView>
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalSubText: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  newStreakButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  message: {
    fontFamily: "Lato_700Bold",
    fontSize: 16,
  },
});
