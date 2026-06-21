import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { InputProps } from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const Input = ({
  icon,
  containerStyle,
  inputStyle,
  inputRef,
  ...rest
}: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        ref={inputRef}
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.neutral500}
        {...rest}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral800,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.neutral700,
    paddingHorizontal: spacingX._15,
    height: verticalScale(54),
  },
  icon: {
    marginRight: spacingX._10,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(15),
  },
});
