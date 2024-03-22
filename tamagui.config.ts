import { createFont, createTamagui, createTokens } from "tamagui";

const robotoFont = createFont({
  family: "Roboto",
  size: {
    1: 16,
    2: 18,
    3: 20,
  },
  lineHeight: {
    1: 22,
    2: 24,
    3: 26,
  },
  weight: {
    1: "400",
    2: "700",
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1,
  },
  face: {
    400: { normal: "RobotoRegular" },
    700: { normal: "RobotoBold" },
  },
});

const latoFont = createFont({
  family: "Lato",
  size: {
    1: 16,
    2: 18,
    3: 20,
  },
  lineHeight: {
    1: 22,
    2: 24,
    3: 26,
  },
  weight: {
    1: "400",
    2: "700",
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1,
  },
  face: {
    400: { normal: "LatoRegular" },
    700: { normal: "LatoBold" },
  },
});

const tokens = createTokens({
  size: {
    small: 20,
    medium: 30,
    true: 30,
    large: 40,
  },

  space: {
    small: 10,
    medium: 20,
    true: 20,
    large: 30,
  },

  radius: { small: 5, medium: 10, large: 15 },

  zIndex: { small: 0, medium: 100, large: 200 },

  color: {
    primary: "#3490de",

    darkGray: "#181818",

    white: "#fff",

    black: "#000",
  },
});
const config = createTamagui({
  fonts: {
    roboto: robotoFont,
    lato: latoFont,
  },
  tokens,
  themes: {
    light: {
      bg: "#f2f2f2",
      color: tokens.color.black,
    },
    dark: {
      bg: tokens.color.darkGray,
      color: tokens.color.white,
    },
  },

  shorthands: {
    px: "paddingHorizontal",
    f: "flex",
    m: "margin",
    w: "width",
  } as const,
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
