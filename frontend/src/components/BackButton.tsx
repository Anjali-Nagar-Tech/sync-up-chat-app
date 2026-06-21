import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { BackButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const BackButton = ({ style, color = colors.white, iconSize = 20 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.btn, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={{ color, fontSize: verticalScale(iconSize), fontWeight: "600" }}>
        ‹
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    width: verticalScale(38),
    height: verticalScale(38),
    justifyContent: "center",
    alignItems: "center",
  },
});
