import "dotenv/config";
export default {
  expo: {
    name: "Gym Pulse",
    slug: "gym-pulse",
    version: "1.2.4",
    scheme: "your-app-scheme",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/iconSplash.png",
      resizeMode: "contain",
      backgroundColor: "#181818",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.eronkgonk.gympulse",
      config: {
        googleMobileAdsAppId: process.env.ADMOB_IOS_APP_ID,
      },
      newArchEnabled: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#181818",
      },
      config: {
        googleMobileAdsAppId: process.env.ADMOB_ANDROID_APP_ID,
      },
      versionCode: 1,
      package: "com.eronkgonk.gympulse",
      newArchEnabled: true,
    },
    web: {
      favicon: "./assets/newLogo.png",
    },
    plugins: [["expo-font"], "expo-router"],
    extra: {
      eas: {
        projectId: "931123fa-8703-4a70-ba2a-8d02f9cd7dc9",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      admobIOSAppId: process.env.ADMOB_IOS_APP_ID,
      admobAndroidAppId: process.env.ADMOB_ANDROID_APP_ID,
      admobIOSStreakUnitId: process.env.ADMOB_STREAK_UNIT_ID_IOS,
      admobAndroidStreakUnitId: process.env.ADMOB_STREAK_UNIT_ID_ANDROID,
      admobCreatePostAdUnitIOS: process.env.ADMOB_CREATE_POST_AD_UNIT_IOS,
      admobCreatePostAdUnitAndroid:
        process.env.ADMOB_CREATE_POST_AD_UNIT_ANDROID,
      openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID,
      openaiProjectId: process.env.OPENAI_PROJECT_ID,
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
    experiments: {
      typedRoutes: true,
    },
    owner: "guan-eric",
    updates: {
      url: "https://u.expo.dev/931123fa-8703-4a70-ba2a-8d02f9cd7dc9",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
