import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function Toggle() {
  const [on, setOn] = useState(false);

  return (
      <Pressable 
        style={[styles.toggle, on && styles.toggleOn]}
        onPress={() => setOn((prev) => !prev)}
      >        
        <Text style={[styles.label, on && styles.labelOn]}>
            {on ? "ON" : "OFF"}
        </Text>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle:  {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  toggleOn: {
    backgroundColor: "#2563eb",
  },
  label: {
    fontWeight: "600", 
    color: "#374151"
  },
  labelOn: { 
    color: "#fff"
  }
});