import { saveTracker } from "@/api/trackers";
import { usePalette } from "@/hooks/usePalette";
import { AddTrackerForm, validateTrackers } from "@/utils/validateTrackers";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fromDateString = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : new Date();
};

const CATEGORY_OPTIONS = ["Mental Health", "Physical Health", "Sleep", "Nutrition", "Fitness", "Medication", "Other"];
const TYPE_OPTIONS = ["Tracker", "Journal"];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Yearly"];
const BY_OPTIONS = ["By Color", "By Text"];

const EMPTY_FORM: AddTrackerForm = {
    name: "",
    category: "",
    type: "",
    frequency: "",
    by: "",
    date: "",
    icon: "", // add as picker later
    active: true,
    notes: "",
}

type Touched = Partial<Record<keyof AddTrackerForm, boolean>>;

type SelectProps = {
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  hasError?: boolean;
  accessibilityLabel: string;
};

function Select({ value, options, placeholder, onSelect, onClose, hasError, accessibilityLabel }: SelectProps) {
  const c = usePalette();
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <Pressable
        style={[
          styles.input,
          styles.dateButton,
          { backgroundColor: c.card, borderColor: hasError ? c.danger : c.border },
        ]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: value || "none selected" }}
      >
        <Text style={{ color: value ? c.text : c.muted, fontSize: 16 }}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={c.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={[styles.sheet, { backgroundColor: c.card, borderColor: c.border }]}>
            <FlatList
              data={options}
              keyExtractor={(o) => o}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    style={styles.option}
                    onPress={() => {
                      onSelect(item);
                      close();
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text style={{ color: c.text, fontSize: 16 }}>{item}</Text>
                    {selected ? (
                      <Ionicons name="checkmark" size={20} color={c.primary} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default function AddTracker() {
  const c = usePalette();
  const [form, setForm] = useState<AddTrackerForm>(() => ({
    ...EMPTY_FORM,
    date: toDateString(new Date()),
  }));
  const [touched, setTouched] = useState<Touched>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const errors = validateTrackers(form);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const touch = (key: keyof AddTrackerForm) =>
    setTouched((current: any) =>({ ...current, [key]:true}));

  const errorFor = (key: keyof AddTrackerForm) =>
    touched[key] || submitAttempted ? errors[key] : undefined;

  const update = <K extends keyof AddTrackerForm>(key: K, value: AddTrackerForm[K]) =>
    setForm((current) => ({ ...current, [key]: value}));

  const inputStyle = (key: keyof AddTrackerForm) => [
    styles.input, {
      color: c.text, 
      backgroundColor: c.card, 
      borderColor: errorFor(key) ? c.danger : c.border,
    },
  ];

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false); 
    if (event.type === "set" && selected) {
      update("date", toDateString(selected));
      touch("date");
    }
  };
 
  const handleSubmit = async () => {
    if (submitting) return;
    Keyboard.dismiss();
    setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;
 
    setSubmitting(true);
    setSubmitError(null);
    try {
      const saved = await saveTracker({
        name: form.name.trim(),
        category: form.category.trim(),
        type: form.type.trim(),
        frequency: form.frequency.trim(),
        by: form.by,
        date: form.date,
        icon: form.icon,
        active: form.active,
        notes: form.notes.trim(),
      });
      Alert.alert("Saved", `${saved.name} was saved.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      // Log the technical detail and show the user something they can act on.
      console.warn("saveTracker failed:", e);
      setSubmitError(
        "We could not save your tracker. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
// Keyboard Management
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS ==="ios" ? "padding" : undefined}
    >

{/* Scrolling Management */}
      <ScrollView 
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
      
{/* Error Handeling */}
      {submitError ? (
        <View
          style={[styles.banner, { borderColor: c.danger }]}
          accessibilityRole="alert"
        >
          <Ionicons name="alert-circle-outline" size={20} color={c.danger} />
          <Text style={[styles.bannerText, { color: c.danger }]}>
            {submitError}
          </Text>
        </View>
      ) : null}

        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: c.text }]}>Active Tracker</Text>
          <Switch
            value={form.active}
            onValueChange={(v) => update("active", v)}
            trackColor={{ false : c.border, true: c.primary }}
            ios_backgroundColor={c.border}
            thumbColor={c.text}
            accessibilityLabel="Active Tracker"
          />
        </View>

        <Field label="Tracker Name *" error={errorFor("name")}>
          <TextInput
            style={inputStyle("name")}
            value={form.name}
            onChangeText={(t) => update("name", t)}
            onBlur={() => touch("name")}
            placeholder="Mood"
            placeholderTextColor={c.muted}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Tracker Name Required"
          />
        </Field>

        <Field label="Category *" error={errorFor("category")}>
          <Select
            value={form.category}
            options={CATEGORY_OPTIONS}
            placeholder="Select a category"
            onSelect={(v) => update("category", v)}
            onClose={() => touch("category")}
            hasError={!!errorFor("category")}
            accessibilityLabel="Category Required"
          />
        </Field>

        <Field label="Type *" error={errorFor("type")}>
          <Select
            value={form.type}
            options={TYPE_OPTIONS}
            placeholder="Select a type"
            onSelect={(v) => update("type", v)}
            onClose={() => touch("type")}
            hasError={!!errorFor("type")}
            accessibilityLabel="Type Required"
          />
        </Field>

        <Field label="Frequency *" error={errorFor("frequency")}>
          <Select
            value={form.frequency}
            options={FREQUENCY_OPTIONS}
            placeholder="Select a frequency"
            onSelect={(v) => update("frequency", v)}
            onClose={() => touch("frequency")}
            hasError={!!errorFor("frequency")}
            accessibilityLabel="Frequency Required"
          />
        </Field>

        <Field label="By Color or Text *" error={errorFor("by")}>
          <Select
            value={form.by}
            options={BY_OPTIONS}
            placeholder="Select one"
            onSelect={(v) => update("by", v)}
            onClose={() => touch("by")}
            hasError={!!errorFor("by")}
            accessibilityLabel="By Color or Text Required"
          />
        </Field>

        <Field label="Date" error={errorFor("date")}>
          <Pressable
            style={[styles.input, styles.dateButton, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={() => setShowDatePicker((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel="Date, opens calendar"
          >
            <Text style={{ color: form.date ? c.text : c.muted, fontSize: 16 }}>
              {form.date ? fromDateString(form.date).toLocaleDateString() : "Today"}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={c.muted} />
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={fromDateString(form.date)}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeDate}
            />
          )}
        </Field>

        <Field label="Notes" error={errorFor("notes")}>
          <TextInput
            style={[inputStyle("notes"), styles.notes]}
            value={form.notes}
            onChangeText={(t) => update("notes", t)}
            onBlur={() => touch("notes")}
            placeholder="Details about this Tracker"
            placeholderTextColor={c.muted}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Notes"
          />
        </Field>
        <Text style={{ color: c.muted }}>* Required</Text>

{/* Save Button */}
        <Pressable
          style={[styles.save, { backgroundColor: c.primary, borderColor: c.text}]}
          disabled={submitting}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityState={{disabled: submitting, busy: submitting }}
        >
          {submitting ? <ActivityIndicator color={c.text} /> : null}
          <Text style={styles.saveText}>
            {submitting ?"Saving..." : submitError ? "Try again" : "Save"}
          </Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>  
  )
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Field({ label, error, hint, children }: FieldProps) {
  const c = usePalette();

  return (
    <View style={styles.field}>
        <Text style={[styles.label, {color: c.text }]}>{label}</Text>
        {children}
        {error ? (
          <Text
            style={[styles.message, {color: c.danger}]}
            accessibilityRole="alert" 
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        ) : hint ? (
          <Text style={[styles.message, { color:c.muted }]}>{hint}</Text>
        ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { padding: 16, gap: 12 },
  field: { gap: 4 },
  label: { fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  notes: { minHeight: 96 },
  message: { fontSize: 12 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
  },
  save: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-end",
    borderRadius: 10,
    borderWidth: 0.5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
  },
  bannerText: {
    padding: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: "60%",
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
})