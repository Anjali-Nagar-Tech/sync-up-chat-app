import React from "react";
import { View, StyleSheet } from "react-native";
import { HeaderProps } from "@/types";
import Typo from "./Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";

const Header = ({ title, leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>{leftIcon ?? null}</View>
      <View style={styles.center}>
        {title ? (
          <Typo size={17} fontWeight="700" color={colors.white} style={styles.title}>
            {title}
          </Typo>
        ) : null}
      </View>
      <View style={styles.side}>{rightIcon ?? null}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    backgroundColor: colors.neutral900,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  side: {
    width: 44,
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
});
