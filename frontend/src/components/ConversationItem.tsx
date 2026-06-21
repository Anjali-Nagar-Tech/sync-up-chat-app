import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Avatar from "./Avatar";
import Typo from "./Typo";

interface ConversationItemProps {
  id: string;
  username: string;
  lastMessage: string;
  time: string;
  onPress: () => void;
}

const ConversationItem = ({
  username,
  lastMessage,
  time,
  onPress,
}: ConversationItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar size={48} uri={null} username={username} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Typo size={15} fontWeight="700" color={colors.white}>
            {username}
          </Typo>
          <Typo size={11} color={colors.neutral500}>
            {time}
          </Typo>
        </View>
        <Typo
          size={13}
          color={colors.neutral500}
          textProps={{ numberOfLines: 1 }}
          style={styles.preview}
        >
          {lastMessage}
        </Typo>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  body: {
    flex: 1,
    marginLeft: spacingX._12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  preview: {
    marginTop: 1,
  },
});
