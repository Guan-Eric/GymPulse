import "dotenv/config";
export default {
  expo: {
    name: "Gym Pulse",
    slug: "gym-pulse",
    version: "1.4.3",
    scheme: "your-app-scheme",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/iconSplash.png",
      resizeMode: "contain",
      backgroundColor: "#181818",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.eronkgonk.gympulse",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#181818",
      },
      package: "com.eronkgonk.gympulse",
    },
    web: {
      bundler: "metro",
      output: "static",
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
      openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID,
      openaiProjectId: process.env.OPENAI_PROJECT_ID,
      openaiApiKey: process.env.OPENAI_API_KEY,
      revenueCatApiKey: process.env.REVENUECAT_API_KEY,
      nodeEnv: process.env.NODE_ENV,
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
