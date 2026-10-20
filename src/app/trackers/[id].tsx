// Purpose: Individual Tracker view. Shows all data for tracker selected. 
// Issue: The tabs are not showing at the bottom. 
// Issue: the light/dark toggle is not showing.

import { useYourTrackers } from "@/context/YourTrackersContext";
import { trackers } from "@/data/trackers";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function TrackerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = usePalette();
  const { isYourTrackers, toggleYourTrackers } = useYourTrackers();
  const tracker = trackers.find((t) => t.id === id);


// When there are no trackers in use or active in the Your Trackers tab. It desplays 
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
        
{/* Header row with icon, title and type of tracker badge. */}
        <View style={styles.header}>
          <Ionicons name={tracker.icon as any} size={30} color={c.muted} />
          <Text style={[styles.name, { color: c.text }]}>{tracker.name}</Text>

          <View style={[styles.badge, { backgroundColor: c.primary }]}>
            <Text style={styles.badgeText}>{tracker.type}</Text>
          </View>
        </View>
 
{/* Tracker Information with frequency, category, and by. */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-number-outline" size={18} color={c.muted} />
          <Text style={[styles.infoText, { color: c.muted }]}>
             {tracker.frequency}
          </Text>

          <Ionicons name="medkit-outline" size={18} color={c.muted} />
          <Text style={[styles.infoText, { color: c.muted }]}>
             {tracker.category}
          </Text>

          <Ionicons name="color-palette-outline" size={18} color={c.muted} />
          <Text style={[styles.infoText, { color: c.muted }]}>
             {tracker.by}
          </Text>
        </View>

{/* TOO UPDATE WITH "ACTIVE TRACKER" SWITCH... Toggle button for saving tracker as active/in use tracker by user.
        <Pressable
          onPress={() => toggleYourTrackers(tracker.id)}
          style={({ pressed }) => [
            styles.trackerButton,
            { borderColor: c.primary, opacity: pressed ? 0.7 : 1 },
            yourtracker && { backgroundColor: c.primary },
          ]}
        >
          <Ionicons
            name={yourtracker ? "checkbox" : "checkbox-outline"}
            size={18}
            color={yourtracker ? "#fff" : c.primary}
          />
          <Text
            style={[styles.trackerText, { color: yourtracker ? "#fff" : c.primary }]}>
            {yourtracker ? "Added" : "Add to Your Trackers"}
          </Text>
        </Pressable> */}

{/* Area for notes */}
        {tracker.notes && (
          <Text style={[styles.notes, { color: c.text }]}>
            Notes: {tracker.notes}
          </Text>
        )}
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    padding: 16 
  },
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
    borderRadius: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
},name: {
    flex: 1, 
    fontSize: 22,
    fontWeight: "700",
    marginRight: 12,
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
  notes: {
    fontSize: 14,
    lineHeight: 20,
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