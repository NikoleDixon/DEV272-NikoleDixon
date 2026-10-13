import { useYourTrackers } from "@/context/YourTrackersContext";
import { trackers } from "@/data/trackers";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

//
export default function TrackerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = usePalette();
  const { isYourTrackers, toggleYourTrackers } = useYourTrackers();
  const tracker = trackers.find((t) => t.id === id);

  if (!tracker) {
    return (
      <View style={styles.screen}>
        <View
          style={[
            styles.card,
            { backgroundColor: c.card, borderColor: c.cardBorder },
          ]}
        >
          <Text style={[styles.name, { color: c.text }]}>Not found</Text>
          <Text style={{ color: c.muted }}>No tracker with id {id}.</Text>
        </View>
      </View>
    );
  }
 //
  const yourtracker = isYourTrackers(tracker.id);
 
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: tracker.name }} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.card, borderColor: c.cardBorder },
        ]}
      >
        <View style={[styles.badge, { backgroundColor: c.primary }]}>
          <Text style={styles.badgeText}>{tracker.type}</Text>
        </View>
 
        <Text style={[styles.name, { color: c.text }]}>{tracker.name}</Text>
 
        <View style={styles.infoRow}>
          <Ionicons name="calendar-clear-outline" size={18} color={c.muted} />
          <Text style={[styles.infoText, { color: c.muted }]}>
             {tracker.frequency}
          </Text>
        </View>
 
        <View style={[styles.divider, { backgroundColor: c.cardBorder }]} />

        <Pressable
          onPress={() => toggleYourTrackers(tracker.id)}
          style={({ pressed }) => [
            styles.trackerButton,
            { borderColor: c.primary, opacity: pressed ? 0.7 : 1 },
            yourtracker && { backgroundColor: c.primary },
          ]}
        >
          <Ionicons
            name={yourtracker ? "star" : "star-outline"}
            size={18}
            color={yourtracker ? "#fff" : c.primary}
          />
          <Text
            style={[styles.trackerText, { color: yourtracker ? "#fff" : c.primary }]}
          >
            {yourtracker ? "Added" : "Add to Your Trackers"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  trackerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  trackerText: {
    fontSize: 15,
    fontWeight: "600",
  },
})