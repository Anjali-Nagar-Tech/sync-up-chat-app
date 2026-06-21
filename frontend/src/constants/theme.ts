import { scale, verticalScale } from "@/utils/styling";

export const colors = {
  primary: "#7C3AED",       // Purple
  primaryLight: "#A78BFA",  // Light Purple
  primaryDark: "#5B21B6",   // Deep Purple

  text: "#1F1B2E",
  white: "#FFFFFF",
  black: "#000000",

  rose: "#EC4899",

  // Chat bubbles
  otherBubble: "#F3E8FF",   // Light Lavender
  myBubble: "#DDD6FE",      // Soft Purple

  green: "#22C55E",

  // Neutral palette
  neutral50: "#FAFAFF",
  neutral100: "#F4F3FF",
  neutral200: "#E9E7FF",
  neutral300: "#D8D4FE",
  neutral350: "#CFCBFF",
  neutral400: "#AFA7FF",
  neutral500: "#7E77A8",
  neutral600: "#5F5A7A",
  neutral700: "#433D5C",
  neutral800: "#2A243F",
  neutral900: "#171325",
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
  _70: verticalScale(70),
  _80: verticalScale(80),
  _90: verticalScale(90),
  full: 200,
};
