import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { API_URL } from "@/constants/api";
import { disconnectSocket } from "@/services/socket";

const AuthContext = createContext<AuthContextProps | null>(null);

const TOKEN_KEY = "auth_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      if (stored) {
        const decoded = jwtDecode<DecodedTokenProps>(stored);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          await AsyncStorage.removeItem(TOKEN_KEY);
          router.replace("/(auth)/welcome");
        } else {
          setToken(stored);
          setUser(decoded.user);
          router.replace("/(app)/home");
        }
      } else {
        router.replace("/(auth)/welcome");
      }
    } catch {
      router.replace("/(auth)/welcome");
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  const updateToken = async (newToken: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    const decoded = jwtDecode<DecodedTokenProps>(newToken);
    setToken(newToken);
    setUser(decoded.user);
  };

  const signIn = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Login failed");
    await updateToken(data.token);
    router.replace("/(app)/home");
  };

  const signUp = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Registration failed");
    await updateToken(data.token);
    router.replace("/(app)/home");
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    disconnectSocket();
    setToken(null);
    setUser(null);
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
