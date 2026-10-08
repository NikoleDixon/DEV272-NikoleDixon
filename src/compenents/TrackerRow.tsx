import { Tracker } from "@/app/data/trackers";
import { Palette } from "@/constants/colors";
import { Platform, StyleSheet, Text, View } from "react-native";

export function TrackerRow({ 
    tracker, 
    c, 
}: { 
    tracker: Tracker, 
    c: Palette 
}) {
  
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.cardBorder },
      ]}
    >
      <View style={styles.cardMain}>
        <Text style={[styles.cardTitle, { color: c.text }]}>
          {tracker.name}
        </Text>
        <Text style={{ color: c.muted }}>{tracker.type}</Text>
      </View>
        <Text style={{ color: c.muted}}>
            {tracker.frequency}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        ...Platform.select({
            ios: { 
                shadowColor: "#000",
                shadowOpacity: 0.1, 
                shadowRadius: 4 ,
                shadowOffset: { width: 0, height: 2 },
            },
            android: { elevation: 2 },
        })
    },
    cardMain: {flex: 1, gap: 2},
    cardTitle: {fontWeight: "600", marginBottom: 8 },
});
