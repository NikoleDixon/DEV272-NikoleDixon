import { saveTracker } from "@/api/trackers";
import { usePalette } from "@/hooks/usePalette";
import { AddTrackerFormValues, TrackerData, trackerSchema } from "@/utils/trackerSchema";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { useForm, type Control } from "react-hook-form";
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { ZodBoolean, ZodObject, ZodString } from "zod";
import { $strip } from "zod/v4/core";

const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fromDateString = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : new Date();
};

// These were in use before React Hook and zod...
const CATEGORY_OPTIONS = ["Mental Health", "Physical Health", "Sleep", "Nutrition", "Fitness", "Medication", "Other"];
const TYPE_OPTIONS = ["Tracker", "Journal"];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Yearly"];
const BY_OPTIONS = ["By color", "By text"];

const DEFAULT_VALUES: AddTrackerFormValues = {
    name: "",
    category: "",
    type: "",
    frequency: "",
    by: "",
    date: "",
    goal: "90",
    icon: "", // add as picker later
    active: true,
    notes: "",
}

type TrackerControl = Control<AddTrackerFormValues, unknown, TrackerData>;

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
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {add} = useTrackers();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddTrackerFormValues, unknown, TrackerData>({
    resolver: zodResolver(trackerSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });



  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false); 
    if (event.type === "set" && selected) {
    }
  };
 
  const onSubmit = async (data: TrackerData) => {
    setSubmitError(null);
    try {
      const saved = await saveTracker(data);
        add(saved);
        router.back();
    } catch (e) {
      console.warn("saveTracker failed:", e);
      setSubmitError(
        "We could not save your tracker. Check your connection and try again.",
      );
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit) ();
  }

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

{/* Form */}
        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: c.text }]}>Active Tracker</Text>
          <Switch
            trackColor={{ false : c.border, true: c.primary }}
            accessibilityLabel="Active Tracker"
          />
        </View>

        <TextField
          control={control}
          name="name"
          label="Name"
          >
        </TextField>

        <TextField
          control={control}
          name="category"
          label="Category *"
          >
        </TextField>

        <TextField
          control={control}
          name="type"
          label="Type *"
        >
        </TextField>

        <TextField
          control={control}
          name="frequency"
          label="Frequency *"
        >
        </TextField>

        <TextField
          control={control}
          name="by"
          label="By Color or Text *"
        >
        </TextField>


{/* Im not sure how to change this one and still have the date picker... */}
        <TextField label="Date">
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
        </TextField>

        <Field label="Notes">
          <TextInput
            multiline
            textAlignVertical="top"
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

function zodResolver(trackerSchema: ZodObject<{ name: ZodString; category: ZodString; type: ZodString; frequency: ZodString; by: ZodString; date: ZodString; goal: ZodString; icon: ZodString; active: ZodBoolean; notes: ZodString; }, $strip>) {
  throw new Error("Function not implemented.");
}
