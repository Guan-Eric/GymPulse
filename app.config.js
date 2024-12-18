import "dotenv/config";
export default {
  expo: {
    name: "Gym Pulse",
    slug: "gympulse",
    version: "1.0.2",
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
      package: "com.eronkgonk.gympulse",
      googleServicesFile: "./android/app/google-services.json",
      newArchEnabled: true,
    },
    web: {
      favicon: "./assets/newLogo.png",
    },
    plugins: [["expo-font"], "expo-router"],
    extra: {
      eas: {
        projectId: "0ca3bc1d-ffa0-46b9-986f-7c478192a465",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      admobIOSStreakUnitId: process.env.ADMOB_STREAK_UNIT_ID_IOS,
      admobAndroidStreakUnitId: process.env.ADMOB_STREAK_UNIT_ID_ANDROID,
    },
    experiments: {
      typedRoutes: true,
    },
    owner: "eronkgonk",
    updates: {
      url: "https://u.expo.dev/0ca3bc1d-ffa0-46b9-986f-7c478192a465",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
