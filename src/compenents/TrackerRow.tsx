import { Tracker } from "@/data/trackers";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export function TrackerRow({ tracker }: { tracker: Tracker }) {
  const c = usePalette();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/trackers/[id]",
          params: { id: tracker.id },
        })
      }
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: c.card, borderColor: c.cardBorder },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={tracker.icon as any} size={28} color={c.primary} />
      <View style={styles.cardMain}>
        <Text style={[styles.cardTitle, { color: c.text }]}>
          {tracker.name}
        </Text>
        <Text style={[styles.cardSubtitle, { color: c.muted }]}>
          {tracker.type}
        </Text>
      </View>
      <Text style={[styles.frequency, { color: c.muted }]}>
        {tracker.frequency}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  pressed: { opacity: 0.7 },
  cardMain: { flex: 1, gap: 2 },
  cardTitle: { fontWeight: "600", marginBottom: 4, fontSize: 18 },
  cardSubtitle: { fontSize: 14 },
  frequency: { fontSize: 14, fontWeight: "500" },
});
