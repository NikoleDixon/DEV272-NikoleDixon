// Purpose: Toggle button to change between light and dark colors.

import { colors } from "@/constants/colors";
import { Appearance, Pressable, StyleSheet, Text, useColorScheme } from "react-native";

export default function Toggle() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const c = colors[isDark ? "dark" : "light"];

  return (
      <Pressable 
        onPress={() => Appearance.setColorScheme?.(isDark ? "light" : "dark")}
        onLongPress={() => Appearance.setColorScheme?.("unspecified")}
        hitSlop={8}
        accessibilityRole="switch"
        accessibilityLabel="Dark mode"
        accessibilityState={{ checked: isDark }}
        style={[
          styles.toggle,
          { 
            backgroundColor: c.primary,
            borderColor: c.text,
          },
        ]}
      >
        <Text style={[styles.label, { color: c.text }]}>
            {isDark ? "☀️ Light" : "🌙 Dark"}
        </Text>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    marginRight: 15,
    fontSize: 14, 
    fontWeight: "600", 
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});