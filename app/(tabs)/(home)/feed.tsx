import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
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
import StreakTooltip from "../../../components/StreakTooltip";
import { isAfter } from "date-fns";
import { Timestamp } from "firebase/firestore";
import Constants from "expo-constants";
import TermsConditionModal from "../../../components/modal/TermsCondditionModal";

const FeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [streakResetModalVisible, setStreakResetModalVisible] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [termsCondition, setTermsCondition] = useState(false);
  const [longestStreak, setLongestStreak] = useState(0);

  const {
    expoPushToken,
    notification,
    hasNewNotification,
    markNotificationsAsRead,
  } = usePushNotifications();
  const AD_POSITION_INTERVAL = 5;

  async function fetchFeed() {
    try {
      const feed = await getFeed();
      setPosts(feed);
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

  function handleLoadAndShowAd() {
    try {
      const adUnitId =
        Platform.OS === "ios"
          ? Constants.expoConfig?.extra?.admobIOSStreakUnitId
          : Constants.expoConfig?.extra?.admobAndroidStreakUnitId;

      const ad = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });
      console.log(ad);
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        ad.show();
      });

      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        handleContinueStreak();
      });

      ad.load();
    } catch (error) {
      console.error("Error showing reward ad", error);
    }
  }

  useEffect(() => {
    initializeTheme();
    fetchFeed();
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
    setStreakResetModalVisible(false);
  };

  const handleTermsCondition = () => {
    updateTermsCondition();
    setStreakResetModalVisible(false);
  };

  const renderItem = ({ item, index }) => {
    if ((index + 1) % AD_POSITION_INTERVAL === 0) {
      return (
        <View style={{ marginVertical: 10 }}>
          {/* <AdMobBanner
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
        tab={"(home)"}
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
            <StreakTooltip
              currentStreak={currentStreak}
              longestStreak={longestStreak}
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
          onContinueStreak={handleLoadAndShowAd}
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
