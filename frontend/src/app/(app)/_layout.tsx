import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token === null) {
      router.replace("/(auth)/welcome");
    }
  }, [token]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
