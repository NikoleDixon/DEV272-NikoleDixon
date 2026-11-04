// Purpose: Month calendar view for a tracker showing the custom legend, month navigation, and interactive daily color logging.

import { DayEntryModal } from "@/components/DayEntryModal";
import { LegendEditModal } from "@/components/LegendEditModal";
import { usePalette } from "@/hooks/usePalette";
import { useTrackerTracking } from "@/hooks/useTrackerTracking";
import { TrackerLegendItem } from "@/types/tracking";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type TrackerMonthViewProps = {
  trackerId: string;
  initialDate?: string; // Optional 'YYYY-MM-DD'
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const YEARS = [
  2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037,
  2038, 2039, 2040,
];

// Returns dark text on light backgrounds, white text on dark backgrounds
function getContrastColor(hexColor?: string): string {
  if (!hexColor) return "#111827";
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#111827" : "#ffffff";
}

export function TrackerMonthView({
  trackerId,
  initialDate,
}: TrackerMonthViewProps) {
  const c = usePalette();
  const { legend, entries, setDayEntry, saveLegend } =
    useTrackerTracking(trackerId);

  // Initialize month / year from initialDate or today
  const initDate = (() => {
    if (initialDate) {
      const [y, m, d] = initialDate.split("-").map(Number);
      if (y && m && d) return new Date(y, m - 1, d);
    }
    return new Date();
  })();

  const [currentYear, setCurrentYear] = useState<number>(
    initDate.getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(initDate.getMonth()); // 0 - 11
  const [legendCollapsed, setLegendCollapsed] = useState<boolean>(true);

  // Modals state
  const [isEditingLegend, setIsEditingLegend] = useState<boolean>(false);
  const [isPickingYear, setIsPickingYear] = useState<boolean>(false);
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Build the calendar matrix for currentYear and currentMonth
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  type CalendarCell = {
    dayNumber: number;
    dateString: string;
    isCurrentMonth: boolean;
  };

  const cells: CalendarCell[] = [];

  // Leading days from previous month
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      dayNumber: day,
      dateString: dateStr,
      isCurrentMonth: false,
    });
  }

  // Days of current month
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      dayNumber: day,
      dateString: dateStr,
      isCurrentMonth: true,
    });
  }

  // Trailing days from next month to fill out last row
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const dateStr = `${nextYear}-${String(nextMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      dayNumber: day,
      dateString: dateStr,
      isCurrentMonth: false,
    });
  }

  return (
    <View style={styles.container}>
      {/* Collapsible Legend Box */}
      <View
        style={[
          styles.legendCard,
          {
            borderColor: c.primary,
            backgroundColor: `${c.primary}0D`,
          },
        ]}
      >
        <View style={styles.legendHeader}>
          <Pressable
            style={styles.legendTitleRow}
            onPress={() => setIsEditingLegend(true)}
            accessibilityRole="button"
            accessibilityLabel="Edit legend options"
          >
            <Text style={[styles.legendTitle, { color: c.text }]}>Legend</Text>
            <Ionicons name="create-outline" size={18} color={c.primary} />
          </Pressable>

          <Pressable
            onPress={() => setLegendCollapsed((prev) => !prev)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              legendCollapsed ? "Expand legend" : "Collapse legend"
            }
          >
            <Ionicons
              name={legendCollapsed ? "chevron-down" : "chevron-up"}
              size={20}
              color={c.primary}
            />
          </Pressable>
        </View>

        {!legendCollapsed && (
          <View style={styles.legendGrid}>
            {legend.map((item) => (
              <View key={item.id} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text
                  style={[styles.legendLabel, { color: c.text }]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Month Navigation with Clickable Year */}
      <View style={styles.monthNav}>
        <Pressable
          onPress={handlePrevMonth}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={24} color={c.primary} />
        </Pressable>

        <View style={styles.monthNavCenter}>
          <Text style={[styles.monthNavTitle, { color: c.text }]}>
            {MONTH_NAMES[currentMonth]}
          </Text>

          <Pressable
            style={[
              styles.yearPill,
              {
                backgroundColor: `${c.primary}18`,
                borderColor: c.primary,
              },
            ]}
            onPress={() => setIsPickingYear(true)}
            accessibilityRole="button"
            accessibilityLabel={`Change year, currently ${currentYear}`}
          >
            <Text style={[styles.yearPillText, { color: c.text }]}>
              {currentYear}
            </Text>
            <Ionicons name="chevron-down" size={13} color={c.primary} />
          </Pressable>
        </View>

        <Pressable
          onPress={handleNextMonth}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Ionicons name="chevron-forward" size={24} color={c.primary} />
        </Pressable>
      </View>

      {/* Calendar Grid Table */}
      <View
        style={[
          styles.calendarTable,
          {
            borderColor: c.border,
            backgroundColor: c.card,
          },
        ]}
      >
        {/* Weekday Row */}
        <View
          style={[styles.weekdayRow, { backgroundColor: `${c.primary}25` }]}
        >
          {WEEKDAYS.map((day, idx) => (
            <View key={idx} style={styles.weekdayCell}>
              <Text style={[styles.weekdayText, { color: c.text }]}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Days Matrix */}
        <View style={styles.matrix}>
          {cells.map((cell, idx) => {
            const entry = entries[cell.dateString];
            const hasColor = cell.isCurrentMonth && Boolean(entry?.color);
            const cellBg = hasColor
              ? entry!.color
              : cell.isCurrentMonth
                ? `${c.primary}08`
                : `${c.border}30`;
            const textColor = hasColor
              ? getContrastColor(entry?.color)
              : cell.isCurrentMonth
                ? c.text
                : c.muted;

            return (
              <Pressable
                key={`${cell.dateString}-${idx}`}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: cellBg,
                    borderColor: `${c.border}50`,
                  },
                ]}
                onPress={() => {
                  if (cell.isCurrentMonth) {
                    setSelectedDayDate(cell.dateString);
                  }
                }}
                disabled={!cell.isCurrentMonth}
                accessibilityRole="button"
                accessibilityLabel={`${cell.dateString}${entry?.label ? `, ${entry.label}` : ""}`}
              >
                <View style={styles.dayCellInner}>
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: textColor,
                        fontWeight: hasColor ? "700" : "500",
                      },
                    ]}
                  >
                    {cell.dayNumber}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Edit Legend Modal */}
      <LegendEditModal
        visible={isEditingLegend}
        legend={legend}
        onClose={() => setIsEditingLegend(false)}
        onSave={(updated) => saveLegend(updated)}
      />

      {/* Day Entry Logger Modal */}
      <DayEntryModal
        visible={!!selectedDayDate}
        dateString={selectedDayDate ?? ""}
        legend={legend}
        currentEntry={selectedDayDate ? entries[selectedDayDate] : undefined}
        onClose={() => setSelectedDayDate(null)}
        onSelectOption={(item: TrackerLegendItem | null) => {
          if (selectedDayDate) {
            setDayEntry(selectedDayDate, item);
          }
        }}
      />

      {/* Year Picker Modal */}
      <Modal
        visible={isPickingYear}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPickingYear(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsPickingYear(false)}
        >
          <Pressable
            style={[
              styles.yearModalCard,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[styles.yearModalHeader, { borderBottomColor: c.border }]}
            >
              <Text style={[styles.yearModalTitle, { color: c.text }]}>
                Select Year
              </Text>
              <Pressable
                onPress={() => setIsPickingYear(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close year picker"
              >
                <Ionicons name="close" size={22} color={c.muted} />
              </Pressable>
            </View>

            <View style={styles.yearGrid}>
              {YEARS.map((y) => {
                const isSelected = y === currentYear;
                return (
                  <Pressable
                    key={y}
                    style={[
                      styles.yearCell,
                      {
                        backgroundColor: isSelected ? c.primary : c.background,
                        borderColor: isSelected ? c.primary : c.border,
                      },
                    ]}
                    onPress={() => {
                      setCurrentYear(y);
                      setIsPickingYear(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Year ${y}`}
                  >
                    <Text
                      style={[
                        styles.yearCellText,
                        {
                          color: isSelected ? "#ffffff" : c.text,
                          fontWeight: isSelected ? "700" : "500",
                        },
                      ]}
                    >
                      {y}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 14,
  },
  legendCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  legendHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "22%",
    minWidth: 70,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  monthNavCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthNavTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  yearPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  yearPillText: {
    fontSize: 15,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  yearModalCard: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  yearModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  yearModalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  yearCell: {
    width: "22%",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  yearCellText: {
    fontSize: 15,
  },
  calendarTable: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  weekdayRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  weekdayCell: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: "700",
  },
  matrix: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285%", // 100% / 7 columns
    aspectRatio: 1,
    borderWidth: 0.5,
  },
  dayCellInner: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
});
