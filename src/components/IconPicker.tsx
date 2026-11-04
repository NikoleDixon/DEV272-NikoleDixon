// Purpose: Icon Picker component showing currently selected icon and opening a grid modal.

import { TRACKER_ICONS } from "@/constants/icons";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type IconPickerProps = {
  value: string;
  onSelect: (iconName: string) => void;
  label?: string;
};

export function IconPicker({
  value,
  onSelect,
  label = "Icon",
}: IconPickerProps) {
  const c = usePalette();
  const [open, setOpen] = useState(false);

  const selectedIcon = value || "happy-outline";

  return (
    <>
      <Pressable
        style={[
          styles.iconPicker,
          {
            backgroundColor: c.card,
            borderColor: c.border,
          },
        ]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Choose icon, currently selected ${selectedIcon}`}
      >
        <View style={styles.leftRow}>
          <View style={[styles.iconPreview, { backgroundColor: c.primary }]}>
            <Ionicons name={selectedIcon as any} size={24} color={c.text} />
          </View>
          <Text style={[styles.iconPickerText, { color: c.text }]}>
            {label}
          </Text>
        </View>
        <View style={styles.rightRow}>
          <Text style={[styles.changeText, { color: c.muted }]}>Change</Text>
          <Ionicons name="chevron-forward" size={18} color={c.muted} />
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHeader, { borderBottomColor: c.border }]}>
              <Text style={[styles.sheetTitle, { color: c.text }]}>
                Choose an Icon
              </Text>
              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close icon picker"
              >
                <Ionicons name="close" size={22} color={c.muted} />
              </Pressable>
            </View>

            <FlatList
              data={TRACKER_ICONS}
              keyExtractor={(icon) => icon}
              numColumns={6}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.grid}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item === selectedIcon;
                return (
                  <Pressable
                    style={[
                      styles.iconCell,
                      isSelected && {
                        backgroundColor: c.primary,
                        borderColor: c.border,
                      },
                    ]}
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={item}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Ionicons
                      name={item as any}
                      size={28}
                      color={isSelected ? c.text : c.muted}
                    />
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconPreview: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPickerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  sheet: {
    width: "100%",
    maxWidth: 360,
    height: "80%",
    maxHeight: 640,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  grid: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "center",
  },
  iconCell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
});
