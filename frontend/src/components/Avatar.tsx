import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { AvatarProps } from "@/types";
import { colors, radius } from "@/constants/theme";

interface Props extends AvatarProps {
  username?: string;
}

const Avatar = ({ size = 44, uri, style, username }: Props) => {
  const initials = username ? username.charAt(0).toUpperCase() : "?";

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
        ] as any}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: colors.white,
    fontWeight: "700",
  },
});
