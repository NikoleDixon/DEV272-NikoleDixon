// Purpose: Modal to edit, add, and delete legend options, with a palette picker and hex color input.

import { usePalette } from "@/hooks/usePalette";
import { PALETTE_COLORS, TrackerLegendItem } from "@/types/tracking";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type LegendEditModalProps = {
  visible: boolean;
  legend: TrackerLegendItem[];
  onClose: () => void;
  onSave: (updated: TrackerLegendItem[]) => void;
};

export function LegendEditModal({
  visible,
  legend,
  onClose,
  onSave,
}: LegendEditModalProps) {
  if (!visible) return null;

  return (
    <LegendEditModalInner legend={legend} onClose={onClose} onSave={onSave} />
  );
}

function LegendEditModalInner({
  legend,
  onClose,
  onSave,
}: Omit<LegendEditModalProps, "visible">) {
  const c = usePalette();
  const [items, setItems] = useState<TrackerLegendItem[]>(legend);
  const [selectedId, setSelectedId] = useState<string | null>(
    legend[0]?.id ?? null,
  );
  const [hexInput, setHexInput] = useState<string>(
    legend[0]?.color.replace("#", "").toUpperCase() ?? "",
  );

  const activeItem = items.find((i) => i.id === selectedId) ?? items[0] ?? null;

  const handleSelectActive = (item: TrackerLegendItem) => {
    setSelectedId(item.id);
    setHexInput(item.color.replace("#", "").toUpperCase());
  };

  const handleUpdateLabel = (id: string, newLabel: string) => {
    setItems((curr) =>
      curr.map((item) =>
        item.id === id ? { ...item, label: newLabel } : item,
      ),
    );
  };

  const handleApplyColor = (color: string) => {
    if (!activeItem) return;
    const formatted = color.startsWith("#") ? color : `#${color}`;
    setItems((curr) =>
      curr.map((item) =>
        item.id === activeItem.id ? { ...item, color: formatted } : item,
      ),
    );
    setHexInput(formatted.replace("#", "").toUpperCase());
  };

  const handleHexChange = (text: string) => {
    const cleaned = text.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    setHexInput(cleaned.toUpperCase());
    if (cleaned.length === 3 || cleaned.length === 6) {
      handleApplyColor(`#${cleaned}`);
    }
  };

  const handleAddItem = () => {
    const newItem: TrackerLegendItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: "New Mood",
      color: PALETTE_COLORS[items.length % PALETTE_COLORS.length],
    };
    const next = [...items, newItem];
    setItems(next);
    setSelectedId(newItem.id);
    setHexInput(newItem.color.replace("#", "").toUpperCase());
  };

  const handleDeleteItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    if (selectedId === id) {
      const nextActive = next[0] ?? null;
      setSelectedId(nextActive ? nextActive.id : null);
      if (nextActive) {
        setHexInput(nextActive.color.replace("#", "").toUpperCase());
      }
    }
  };

  const handleSave = () => {
    onSave(items);
    onClose();
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: c.card, borderColor: c.border },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: c.border }]}>
            <Text style={[styles.title, { color: c.text }]}>Edit Legend</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close legend editor"
            >
              <Ionicons name="close" size={24} color={c.muted} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {/* List of items */}
            <Text style={[styles.sectionSubtitle, { color: c.muted }]}>
              Moods & Labels (tap color to edit)
            </Text>

            <View style={styles.itemList}>
              {items.map((item) => {
                const isSelected = activeItem?.id === item.id;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.itemRow,
                      {
                        borderColor: isSelected ? c.primary : c.border,
                        backgroundColor: isSelected
                          ? `${c.primary}15`
                          : "transparent",
                      },
                    ]}
                  >
                    {/* Color Swatch Circle */}
                    <Pressable
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: item.color },
                      ]}
                      onPress={() => handleSelectActive(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Pick color for ${item.label}`}
                    >
                      {isSelected && (
                        <Ionicons name="color-palette" size={14} color="#fff" />
                      )}
                    </Pressable>

                    {/* Label Input */}
                    <TextInput
                      style={[
                        styles.labelInput,
                        {
                          color: c.text,
                          borderColor: c.border,
                          backgroundColor: c.background,
                        },
                      ]}
                      value={item.label}
                      onChangeText={(txt) => handleUpdateLabel(item.id, txt)}
                      placeholder="Label name"
                      placeholderTextColor={c.muted}
                    />

                    {/* Delete Item Button */}
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item.id)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${item.label}`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={c.danger}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* Add Button */}
            <Pressable
              style={[
                styles.addButton,
                { borderColor: c.primary, backgroundColor: `${c.primary}15` },
              ]}
              onPress={handleAddItem}
              accessibilityRole="button"
              accessibilityLabel="Add new mood to legend"
            >
              <Ionicons name="add" size={18} color={c.primary} />
              <Text style={[styles.addButtonText, { color: c.primary }]}>
                Add
              </Text>
            </Pressable>

            {/* Color Editor for selected item */}
            {activeItem && (
              <View
                style={[
                  styles.colorEditorBox,
                  { backgroundColor: c.background, borderColor: c.border },
                ]}
              >
                <Text style={[styles.colorEditorTitle, { color: c.text }]}>
                  Color for &ldquo;{activeItem.label}&rdquo;
                </Text>

                {/* Hex input row */}
                <View style={styles.hexRow}>
                  <View
                    style={[
                      styles.previewSwatch,
                      { backgroundColor: activeItem.color },
                    ]}
                  />
                  <View
                    style={[
                      styles.hexInputWrapper,
                      {
                        backgroundColor: c.card,
                        borderColor: c.border,
                      },
                    ]}
                  >
                    <Text style={[styles.hexHash, { color: c.muted }]}>#</Text>
                    <TextInput
                      style={[styles.hexTextInput, { color: c.text }]}
                      value={hexInput}
                      onChangeText={handleHexChange}
                      maxLength={6}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      placeholder="70C400"
                      placeholderTextColor={c.muted}
                      accessibilityLabel="Hex code"
                    />
                  </View>
                </View>

                {/* Preset swatches grid */}
                <Text style={[styles.presetSubtitle, { color: c.muted }]}>
                  Palette:
                </Text>
                <View style={styles.swatchGrid}>
                  {PALETTE_COLORS.map((hex) => {
                    const isCurrent =
                      activeItem.color.toLowerCase() === hex.toLowerCase();
                    return (
                      <Pressable
                        key={hex}
                        style={[
                          styles.presetSwatch,
                          { backgroundColor: hex },
                          isCurrent && styles.activePresetSwatch,
                        ]}
                        onPress={() => handleApplyColor(hex)}
                        accessibilityRole="button"
                        accessibilityLabel={`Select color ${hex}`}
                      >
                        {isCurrent && (
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Save & Cancel Buttons */}
          <View style={[styles.footer, { borderTopColor: c.border }]}>
            <Pressable
              style={[
                styles.footerButton,
                styles.cancelButton,
                { borderColor: c.border },
              ]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={[styles.footerButtonText, { color: c.text }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.footerButton,
                styles.saveButton,
                { backgroundColor: c.primary },
              ]}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save legend changes"
            >
              <Text style={[styles.footerButtonText, { color: "#fff" }]}>
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 390,
    maxHeight: "88%",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  labelInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  deleteButton: {
    padding: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  colorEditorBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  colorEditorTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  hexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewSwatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  hexInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  hexHash: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 4,
  },
  hexTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  presetSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  swatchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  presetSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  activePresetSwatch: {
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  footerButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
