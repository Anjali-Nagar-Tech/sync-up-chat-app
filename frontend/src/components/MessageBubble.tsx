import React from "react";
import { View, StyleSheet } from "react-native";
import { MessageProps } from "@/types";
import Typo from "./Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const MessageBubble = ({ senderId, content, isMe, createdAt }: MessageProps) => {
  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        {!isMe && (
          <Typo size={11} fontWeight="700" color={colors.primary} style={styles.senderName}>
            {senderId.username}
          </Typo>
        )}
        <Typo
          size={15}
          color={isMe ? colors.neutral900 : colors.neutral100}
          style={styles.content}
        >
          {content}
        </Typo>
        <Typo
          size={10}
          color={isMe ? colors.neutral600 : colors.neutral500}
          style={styles.time}
        >
          {time}
        </Typo>
      </View>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: verticalScale(3),
    paddingHorizontal: spacingX._12,
  },
  rowMe: { justifyContent: "flex-end" },
  rowOther: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "75%",
    borderRadius: radius._15,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._7,
  },
  bubbleMe: {
    backgroundColor: colors.myBubble,
    borderBottomRightRadius: radius._3,
  },
  bubbleOther: {
    backgroundColor: colors.neutral800,
    borderBottomLeftRadius: radius._3,
  },
  senderName: { marginBottom: 2 },
  content: { lineHeight: verticalScale(21) },
  time: { marginTop: 4, textAlign: "right" },
});
