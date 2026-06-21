import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import ConversationItem from "@/components/ConversationItem";
import api from "@/services/api";
import { UserListItem, ConversationPreview } from "@/types";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [previews, setPreviews] = useState<Record<string, ConversationPreview>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Fetch previews for a user list ───────────────────────────────────────
  const fetchPreviews = async (
    userList: UserListItem[]
  ): Promise<Record<string, ConversationPreview>> => {
    const previewMap: Record<string, ConversationPreview> = {};
    await Promise.all(
      userList.map(async (u) => {
        try {
          const res = await api.get(`/messages/${u._id}`);
          const msgs: any[] = res.data;
          const last = msgs[msgs.length - 1];
          previewMap[u._id] = {
            userId: u._id,
            username: u.username,
            lastMessage: last ? last.content : "Start a conversation",
            time: last
              ? new Date(last.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          };
        } catch {
          previewMap[u._id] = {
            userId: u._id,
            username: u.username,
            lastMessage: "Start a conversation",
            time: "",
          };
        }
      })
    );
    return previewMap;
  };

  // ─── Load everything ───────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const res = await api.get("/users");
      const userList: UserListItem[] = res.data;
      setUsers(userList);
      const previewMap = await fetchPreviews(userList);
      setPreviews(previewMap);
    } catch {
      Alert.alert("Error", "Could not load users. Is the backend running?");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Re-run every time this screen comes into focus (returns from chat)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Typo size={22} fontWeight="800" color={colors.white}>
            SyncUp
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            @{user?.username}
          </Typo>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Typo size={13} fontWeight="600" color={colors.rose}>
            Sign Out
          </Typo>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadData();
              }}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => {
            const preview = previews[item._id];
            return (
              <ConversationItem
                id={item._id}
                username={item.username}
                lastMessage={preview?.lastMessage ?? "Start a conversation"}
                time={preview?.time ?? ""}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/chat/[id]",
                    params: { id: item._id, username: item.username },
                  })
                }
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Typo size={14} color={colors.neutral500}>
                {search
                  ? "No users match your search."
                  : "No other users registered yet."}
              </Typo>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    paddingTop: spacingY._40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    marginBottom: spacingY._15,
  },
  logoutBtn: {
    backgroundColor: colors.neutral800,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.rose,
  },
  searchWrapper: {
    paddingHorizontal: spacingX._20,
    marginBottom: spacingY._10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacingY._40,
  },
});
