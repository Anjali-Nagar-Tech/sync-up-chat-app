import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your username and password.");
      return;
    }
    try {
      setLoading(true);
      await signIn(username.trim().toLowerCase(), password);
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Typo size={32} fontWeight="800" color={colors.white}>
              Welcome back
            </Typo>
            <Typo size={15} color={colors.neutral400} style={{ marginTop: 6 }}>
              Sign in to continue
            </Typo>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              containerStyle={{ marginTop: spacingY._15 }}
            />
          </View>

          <Button onPress={handleLogin} loading={loading} style={styles.button}>
            <Typo size={17} fontWeight="700" color={colors.white}>
              Sign In
            </Typo>
          </Button>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/register")}
            style={styles.link}
          >
            <Typo size={14} color={colors.neutral400}>
              Don't have an account?{" "}
              <Typo size={14} color={colors.primaryLight} fontWeight="600">
                Register
              </Typo>
            </Typo>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacingX._25,
    paddingBottom: spacingY._30,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacingY._35,
  },
  form: {
    marginBottom: spacingY._25,
  },
  button: {
    marginBottom: spacingY._20,
  },
  link: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
});
