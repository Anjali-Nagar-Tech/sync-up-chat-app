import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { connectSocket } from "@/services/socket";
import api from "@/services/api";
import { MessageProps, SocketMessagePayload } from "@/types";
import MessageBubble from "@/components/MessageBubble";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";

export default function ChatScreen() {
  const { id: receiverId, username: receiverUsername } =
    useLocalSearchParams<{ id: string; username: string }>();
  const { token, user } = useAuth();

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const listRef = useRef<FlatList>(null);
  // Keep latest user ref so socket callback always has current value
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // ─── Map raw DB message ────────────────────────────────────────────────────
  const mapDbMessage = useCallback(
    (m: any): MessageProps => {
      const senderIdStr =
        typeof m.senderId === "object" ? m.senderId._id : m.senderId;
      return {
        _id: m._id,
        content: m.content,
        createdAt: m.createdAt,
        senderId: {
          _id: senderIdStr,
          username:
            typeof m.senderId === "object" ? m.senderId.username : "",
        },
        receiverId: {
          _id:
            typeof m.receiverId === "object"
              ? m.receiverId._id
              : m.receiverId,
          username:
            typeof m.receiverId === "object"
              ? m.receiverId.username
              : "",
        },
        // isMe: compare string IDs reliably
        isMe: String(senderIdStr) === String(user?.id),
      };
    },
    [user?.id]
  );

  // ─── Load history from MongoDB ─────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!receiverId) return;
    try {
      const res = await api.get(`/messages/${receiverId}`);
      setMessages(res.data.map(mapDbMessage));
    } catch {
      // silent — offline graceful degradation
    } finally {
      setLoading(false);
    }
  }, [receiverId, mapDbMessage]);

  // ─── Socket setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !receiverId) return;

    const socket = connectSocket(token);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onMessage = (payload: SocketMessagePayload) => {
      const me = userRef.current;

      // Only show messages belonging to THIS conversation
      const belongsHere =
        (payload.senderId.id === me?.id &&
          payload.receiverId === receiverId) ||
        (payload.senderId.id === receiverId &&
          payload.receiverId === me?.id);

      if (!belongsHere) return;

      const msg: MessageProps = {
        _id: payload._id,
        content: payload.content,
        createdAt: String(payload.createdAt),
        senderId: {
          _id: payload.senderId.id,
          username: payload.senderId.username,
        },
        receiverId: {
          _id: payload.receiverId,
          username: receiverUsername ?? "",
        },
        isMe: payload.senderId.id === me?.id,
      };

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message:receive", onMessage);
    if (socket.connected) setConnected(true);

    // Load history every time this screen mounts (covers logout+login, restart)
    loadHistory();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message:receive", onMessage);
    };
  }, [token, receiverId]);

  // ─── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return;
    const t = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      120
    );
    return () => clearTimeout(t);
  }, [messages.length]);

  // ─── Send message ──────────────────────────────────────────────────────────
  const sendMessage = () => {
    const content = text.trim();
    if (!content || !receiverId || !token) return;
    const socket = connectSocket(token);
    socket.emit("message:send", { receiverId, content });
    setText("");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Header sits outside KeyboardAvoidingView so it never moves */}
      <Header
        title={receiverUsername ?? "Chat"}
        leftIcon={<BackButton />}
        rightIcon={
          <View
            style={[
              styles.dot,
              {
                backgroundColor: connected
                  ? colors.green
                  : colors.neutral600,
              },
            ]}
          />
        }
      />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
      >
        {/* Messages list */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <MessageBubble {...item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: false })
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Typo size={14} color={colors.neutral500}>
                  No messages yet. Say hello! 👋
                </Typo>
              </View>
            }
          />
        )}

        {/* Input bar — always above keyboard */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={colors.neutral500}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendBtn,
              !text.trim() && styles.sendBtnDisabled,
            ]}
            disabled={!text.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.neutral900,
    paddingTop: Platform.OS === "android" ? spacingY._40 : 0,
  },
  kav: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: spacingY._10,
    flexGrow: 1,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    backgroundColor: colors.neutral900,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._10,
    color: colors.white,
    fontSize: verticalScale(15),
    maxHeight: verticalScale(120),
    borderWidth: 1,
    borderColor: colors.neutral700,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: colors.neutral700,
  },
  sendIcon: {
    color: colors.white,
    fontSize: verticalScale(16),
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
