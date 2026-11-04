// Purpose: Modal to select tracter option by day.

import { usePalette } from "@/hooks/usePalette";
import { TrackerDayEntry, TrackerLegendItem } from "@/types/tracking";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type DayEntryModalProps = {
  visible: boolean;
  dateString: string; // 'YYYY-MM-DD'
  legend: TrackerLegendItem[];
  currentEntry?: TrackerDayEntry;
  onClose: () => void;
  onSelectOption: (item: TrackerLegendItem | null) => void;
};

export function DayEntryModal({
  visible,
  dateString,
  legend,
  currentEntry,
  onClose,
  onSelectOption,
}: DayEntryModalProps) {
  const c = usePalette();

  if (!visible) return null;

  // Format date readable: Thursday, Oct 15, 2026
  const formattedDate = (() => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-").map(Number);
    if (!y || !m || !d) return dateString;
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  })();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: c.card, borderColor: c.border },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: c.border }]}>
            <View>
              <Text style={[styles.title, { color: c.text }]}>Log Entry</Text>
              <Text style={[styles.dateSubtitle, { color: c.muted }]}>
                {formattedDate}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close entry logger"
            >
              <Ionicons name="close" size={24} color={c.muted} />
            </Pressable>
          </View>

          {/* List of Legend options to select */}
          <View style={styles.optionsList}>
            {legend.map((item) => {
              const isSelected =
                currentEntry?.optionId === item.id ||
                currentEntry?.color?.toLowerCase() === item.color.toLowerCase();

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.optionRow,
                    {
                      borderColor: isSelected ? c.primary : c.border,
                      backgroundColor: isSelected
                        ? `${c.primary}18`
                        : c.background,
                    },
                  ]}
                  onPress={() => {
                    onSelectOption(item);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.label}`}
                >
                  <View style={styles.left}>
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <Text
                      style={[
                        styles.label,
                        {
                          color: c.text,
                          fontWeight: isSelected ? "700" : "500",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={c.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Clear entry button if currently logged */}
          {currentEntry ? (
            <Pressable
              style={[
                styles.clearButton,
                { borderColor: c.danger, backgroundColor: `${c.danger}15` },
              ]}
              onPress={() => {
                onSelectOption(null);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear entry for this day"
            >
              <Ionicons name="trash-outline" size={16} color={c.danger} />
              <Text style={[styles.clearButtonText, { color: c.danger }]}>
                Clear Entry
              </Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  dateSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  label: {
    fontSize: 15,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 9,
    marginTop: 4,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
