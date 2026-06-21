import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";

// AuthContext bootstrapAuth() handles routing from here.
// This screen is only briefly visible before the splash hides.
export default function Index() {
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/images/splashImage.png")}
        entering={FadeInDown.duration(600).springify()}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
