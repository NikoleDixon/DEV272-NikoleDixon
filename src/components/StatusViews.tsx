import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { usePalette } from "@/hooks/usePalette";

// The two states every screen that loads data needs besides the data itself.

export function LoadingView() {
  const c = usePalette();

  return (
    <View style={[styles.center, { backgroundColor: c.card }]}>
      <ActivityIndicator size="large" color={c.primary} />
    </View>
  );
}

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const c = usePalette();

  return (
    <View style={[styles.center, { backgroundColor: c.card }]}>
      <Text style={{ color: c.danger }} accessibilityRole="alert">
        {message}
      </Text>
      <Pressable onPress={onRetry} accessibilityRole="button">
        <Text style={[styles.retry, { color: c.primary }]}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  retry: { fontWeight: "600" },
});
