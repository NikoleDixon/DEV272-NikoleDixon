// Purpose: Form to create and add a new tracker with validation using React Hook Form and Zod.

import { saveTracker } from "@/api/trackers";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { usePalette } from "@/hooks/usePalette";
import { AddTrackerFormValues, TrackerData, trackerSchema } from "@/utils/trackerSchema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useRef, useState, type ReactNode } from "react";
import { Controller, useForm, type Control } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

// Date variables
const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fromDateString = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : new Date();
};

// Dropdown Options
const CATEGORY_OPTIONS = ["Mental Health", "Physical Health", "Sleep", "Nutrition", "Fitness", "Medication", "Other"];
const TYPE_OPTIONS = ["Tracker", "Journal"];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Yearly"];
const BY_OPTIONS = ["By color", "By text"];

// Defaults for each value
const DEFAULT_VALUES: AddTrackerFormValues = {
  name: "",
  category: "",
  type: "",
  frequency: "",
  by: "",
  date: toDateString(new Date()),
  goal: "90",
  icon: "ellipsis-vertical-outline",
  active: true,
  notes: "",
};

// Dropdown Select component
type SelectProps = {
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  hasError?: boolean;
  accessibilityLabel: string;
};

// Dropdown/Modal list for option selection
function Select({ value, options, placeholder, onSelect, onClose, hasError, accessibilityLabel }: SelectProps) {
  const c = usePalette();
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  // Dropdown trigger button
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

{/* Modal showing the list of selectable options */}
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

// Text input field setup
type TextFieldProps = {
  control: Control<AddTrackerFormValues, unknown, TrackerData>;
  name: keyof AddTrackerFormValues;
  label: string;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

function TextField({
  control,
  name,
  label,
  placeholder,
  hint,
  multiline,
  keyboardType,
}: TextFieldProps) {
  const c = usePalette();
  const inputRef = useRef<TextInput>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <Field label={label} error={error?.message} hint={hint} onPress={() => inputRef.current?.focus()}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              multiline && styles.notes,
              {
                backgroundColor: c.card,
                borderColor: error ? c.danger : c.border,
                color: c.text,
              },
            ]}
            value={value !== undefined ? String(value) : ""}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={c.muted}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            keyboardType={keyboardType}
            accessibilityLabel={label}
          />
        </Field>
      )}
    />
  );
}

// Dropdown selection field setup
type SelectFieldProps = {
  control: Control<AddTrackerFormValues, unknown, TrackerData>;
  name: keyof AddTrackerFormValues;
  label: string;
  options: string[];
  placeholder: string;
};

function SelectField({
  control,
  name,
  label,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <Field label={label} error={error?.message}>
          <Select
            value={String(value ?? "")}
            options={options}
            placeholder={placeholder}
            onSelect={onChange}
            onClose={onBlur}
            hasError={!!error}
            accessibilityLabel={label}
          />
        </Field>
      )}
    />
  );
}

// Adding a new tracker
export default function AddTracker() {
  const c = usePalette();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { add } = useYourTrackers();

  // Form hook setup
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
  const scrollViewRef = useRef<ScrollView>(null);

  // Form submission handler
  const onSubmit = async (data: TrackerData) => {
    setSubmitError(null);
    try {
      const saved = await saveTracker({
        ...data,
        goal: Number(data.goal),
        icon: data.icon || "happy-outline",
      });
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
    handleSubmit(onSubmit)();
  };

  // Keyboard adjustments
  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: c.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
{/* Scrollable form view */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[styles.form, { backgroundColor: c.background }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={true}
      >
{/* Error message banner */}
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

{/* Active tracker switch */}
        <Controller
          control={control}
          name="active"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchRow}>
              <Text style={[styles.label, { color: c.text }]}>Active Tracker</Text>
              <Switch
                value={Boolean(value)}
                onValueChange={onChange}
                trackColor={{ false: c.border, true: c.primary }}
                accessibilityLabel="Active Tracker"
              />
            </View>
          )}
        />

{/* Tracker name input */}
        <TextField
          control={control}
          name="name"
          label="Name *"
          placeholder="e.g. Daily Meditation"
        />

{/* Category dropdown */}
        <SelectField
          control={control}
          name="category"
          label="Category *"
          options={CATEGORY_OPTIONS}
          placeholder="Select a category"
        />

{/* Tracker type dropdown */}
        <SelectField
          control={control}
          name="type"
          label="Type *"
          options={TYPE_OPTIONS}
          placeholder="Select a type"
        />

{/* Frequency dropdown */}
        <SelectField
          control={control}
          name="frequency"
          label="Frequency *"
          options={FREQUENCY_OPTIONS}
          placeholder="Select a frequency"
        />

 {/* By dropdown */}
        <SelectField
          control={control}
          name="by"
          label="By Color or Text *"
          options={BY_OPTIONS}
          placeholder="Select tracking method"
        />

{/* Goal input */}
        <TextField
          control={control}
          name="goal"
          label="Goal (1-100) *"
          placeholder="90"
          keyboardType="numeric"
          hint="Target completion rate percentage"
        />

{/* Date picker */}
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Date *" error={error?.message}>
              <Pressable
                style={[
                  styles.input,
                  styles.dateButton,
                  {
                    backgroundColor: c.card,
                    borderColor: error ? c.danger : c.border,
                  },
                ]}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDatePicker((open) => {
                    const next = !open;
                    if (next) {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 150);
                    }
                    return next;
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel="Date, opens calendar"
              >
                <Text style={{ color: c.text, fontSize: 16 }}>
                  {value ? fromDateString(value).toLocaleDateString() : "Select Date"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={c.muted} />
              </Pressable>

              {showDatePicker &&
                (Platform.OS === "ios" ? (
                  <View style={[styles.datePickerContainer, { backgroundColor: c.card}]}>
                    <DateTimePicker
                      value={fromDateString(value || toDateString(new Date()))}
                      mode="date"
                      accentColor={c.primary}
                      themeVariant={c.card === "#00261e" ? "dark" : "light"}
                      display="inline"
                      onChange={(event: DateTimePickerEvent, selected?: Date) => {
                        if (event.type === "set" && selected) {
                          onChange(toDateString(selected));
                        }
                      }}
                    />
                  </View>
                ) : (
                  <DateTimePicker
                    value={fromDateString(value || toDateString(new Date()))}
                    mode="date"
                    display="default"
                    positiveButton={{ label: "OK", textColor: c.primary }}
                    negativeButton={{ label: "Cancel", textColor: c.muted }}
                    onChange={(event: DateTimePickerEvent, selected?: Date) => {
                      setShowDatePicker(false);
                      if (event.type === "set" && selected) {
                        onChange(toDateString(selected));
                      }
                    }}
                  />
                ))}
            </Field>
          )}
        />

{/* Notes */}
        <TextField
          control={control}
          name="notes"
          label="Notes"
          placeholder="Details about this Tracker"
          multiline
        />

        <Text style={{ color: c.muted }}>* Required</Text>

{/* Save Button */}
        <Pressable
          style={[styles.save, { backgroundColor: c.primary, borderColor: c.border }]}
          disabled={isSubmitting}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
        >
          {isSubmitting ? <ActivityIndicator color={c.text} /> : null}
          <Text style={[styles.saveText, { color: c.text }]}>
            {isSubmitting ? "Saving..." : submitError ? "Try again" : "Save"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>  
  );
}

// Field wrapper for label, error message, and hint
type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  onPress?: () => void;
  children: ReactNode;
};

function Field({ label, error, hint, onPress, children }: FieldProps) {
  const c = usePalette();

  return (
    <View style={styles.field}>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={6}>
          <Text style={[styles.label, { color: c.text }]}>{label}</Text>
        </Pressable>
      ) : (
        <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      )}
      {children}
      {error ? (
        <Text
          style={[styles.message, { color: c.danger }]}
          accessibilityRole="alert" 
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.message, { color: c.muted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { padding: 16, paddingBottom: 120, gap: 12 },
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
    fontWeight: "600",
  },
  bannerText: {
    padding: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerContainer: {
    alignSelf: "center",
    width: "100%",
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    marginVertical: 4,
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
});
