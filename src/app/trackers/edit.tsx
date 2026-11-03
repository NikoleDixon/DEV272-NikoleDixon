// Purpose: Edit an existing tracker or journal with pre-populated form fields and local deletion.

import { ErrorView, LoadingView } from "@/components/StatusViews";
import ThemeToggle from "@/components/ThemeToggle";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { usePalette } from "@/hooks/usePalette";
import { useTracker } from "@/hooks/useTrackers";
import {
  AddTrackerFormValues,
  TrackerData,
  trackerSchema,
} from "@/utils/trackerSchema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, type ReactNode } from "react";
import { Controller, useForm, type Control } from "react-hook-form";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Date variables
const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fromDateString = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : new Date();
};

// Dropdown Options (matching add.tsx)
const CATEGORY_OPTIONS = [
  "Mental Health",
  "Physical Health",
  "Sleep",
  "Nutrition",
  "Fitness",
  "Medication",
  "Other",
];
const TYPE_OPTIONS = ["Tracker", "Journal"];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Yearly"];
const BY_OPTIONS = ["By color", "By text"];

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

function Select({
  value,
  options,
  placeholder,
  onSelect,
  onClose,
  hasError,
  accessibilityLabel,
}: SelectProps) {
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
          {
            backgroundColor: c.card,
            borderColor: hasError ? c.danger : c.border,
          },
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

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <View
            style={[
              styles.sheet,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
          >
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
  const inputRef = useRef<any>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <Field
          label={label}
          error={error?.message}
          hint={hint}
          onPress={() => inputRef.current?.focus()}
        >
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

// Field wrapper
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

// Main Edit Screen Component
export default function EditTracker() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = usePalette();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    yourtrackers,
    setTrackerActive,
    updateTrackerOverride,
    deleteTrackerData,
    getEffectiveTracker,
  } = useYourTrackers();
  const {
    data: rawTracker,
    isPending,
    isError,
    error,
    refetch,
  } = useTracker(id);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const scrollViewRef = useRef<any>(null);

  if (isPending) return <LoadingView />;

  if (isError) {
    return <ErrorView message={error.message} onRetry={() => refetch()} />;
  }

  if (!rawTracker) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: c.background, paddingTop: insets.top },
        ]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={26} color={c.text} />
          </Pressable>
        </View>
        <View style={styles.form}>
          <View
            style={[
              styles.sheet,
              { padding: 20, backgroundColor: c.card, borderColor: c.border },
            ]}
          >
            <Text style={{ color: c.text, fontSize: 18, fontWeight: "600" }}>
              Tracker Not Found
            </Text>
            <Text style={{ color: c.muted, marginTop: 8 }}>
              No tracker found with id {id}.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const tracker = getEffectiveTracker(rawTracker);
  const isActive = yourtrackers.includes(tracker.id);

  return (
    <EditTrackerForm
      tracker={tracker}
      isActive={isActive}
      c={c}
      insets={insets}
      router={router}
      scrollViewRef={scrollViewRef}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      onSave={(data) => {
        updateTrackerOverride(tracker.id, {
          name: data.name,
          category: data.category,
          type: data.type,
          frequency: data.frequency,
          by: data.by,
          date: data.date,
          goal: Number(data.goal),
          icon: data.icon || tracker.icon || "happy-outline",
          notes: data.notes,
        });
        setTrackerActive(tracker.id, Boolean(data.active));
        router.back();
      }}
      onDelete={() => {
        deleteTrackerData(tracker.id);
        setShowDeleteModal(false);
        router.replace("/(tabs)");
      }}
    />
  );
}

// Inner Form component (holds form hook with initial data from loaded tracker)
type EditTrackerFormProps = {
  tracker: any;
  isActive: boolean;
  c: ReturnType<typeof usePalette>;
  insets: ReturnType<typeof useSafeAreaInsets>;
  router: ReturnType<typeof useRouter>;
  scrollViewRef: any;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (data: TrackerData & { active?: boolean }) => void;
  onDelete: () => void;
};

function EditTrackerForm({
  tracker,
  isActive,
  c,
  insets,
  router,
  scrollViewRef,
  showDatePicker,
  setShowDatePicker,
  showDeleteModal,
  setShowDeleteModal,
  onSave,
  onDelete,
}: EditTrackerFormProps) {
  const { control, handleSubmit } = useForm<
    AddTrackerFormValues,
    unknown,
    TrackerData
  >({
    resolver: zodResolver(trackerSchema),
    defaultValues: {
      name: tracker.name ?? "",
      category: tracker.category ?? "",
      type: tracker.type ?? "Tracker",
      frequency: tracker.frequency ?? "Daily",
      by: tracker.by ?? "By color",
      date: tracker.date ?? toDateString(new Date()),
      goal: tracker.goal !== undefined ? String(tracker.goal) : "90",
      icon: tracker.icon ?? "happy-outline",
      active: isActive,
      notes: tracker.notes ?? "",
    },
    mode: "onTouched",
  });

  const handleSave = () => {
    Keyboard.dismiss();
    handleSubmit((data) => {
      onSave(data);
    })();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: c.background, paddingTop: insets.top },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color={c.text} />
        </Pressable>

        <View style={styles.headerTitle}>
          <Ionicons name={tracker.icon as any} size={22} color={c.primary} />
          <Text style={[styles.headerTitleText, { color: c.text }]}>
            Edit {tracker.name}
          </Text>
        </View>

        <ThemeToggle style={{ marginRight: 0 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.form,
            { backgroundColor: c.background },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Active tracker switch */}
          <Controller
            control={control}
            name="active"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <Text style={[styles.label, { color: c.text }]}>
                  Active Tracker
                </Text>
                <Switch
                  value={Boolean(value)}
                  onValueChange={onChange}
                  trackColor={{ false: c.border, true: c.primary }}
                  accessibilityLabel="Active Tracker Switch"
                />
              </View>
            )}
          />

          {/* Tracker name input */}
          <TextField
            control={control}
            name="name"
            label="Name *"
            placeholder="e.g. Sleep, Water, Mood"
            hint="At least 2 characters"
          />

          {/* Category Dropdown */}
          <SelectField
            control={control}
            name="category"
            label="Category *"
            options={CATEGORY_OPTIONS}
            placeholder="Select a category"
          />

          {/* Type Dropdown */}
          <SelectField
            control={control}
            name="type"
            label="Type *"
            options={TYPE_OPTIONS}
            placeholder="Select a type"
          />

          {/* Frequency Dropdown */}
          <SelectField
            control={control}
            name="frequency"
            label="Frequency *"
            options={FREQUENCY_OPTIONS}
            placeholder="Select a frequency"
          />

          {/* By Dropdown */}
          <SelectField
            control={control}
            name="by"
            label="By *"
            options={BY_OPTIONS}
            placeholder="Select a tracking method"
          />

          {/* Goal Numeric Input */}
          <TextField
            control={control}
            name="goal"
            label="Goal (%) *"
            placeholder="e.g. 90"
            keyboardType="numeric"
            hint="Between 1 and 100"
          />

          {/* Date Picker */}
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
                    setShowDatePicker((open) => !open);
                  }}
                  accessibilityRole="button"
                >
                  <Text
                    style={{ color: value ? c.text : c.muted, fontSize: 16 }}
                  >
                    {value || toDateString(new Date())}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={c.muted} />
                </Pressable>

                {showDatePicker &&
                  (Platform.OS === "ios" ? (
                    <View
                      style={[
                        styles.datePickerContainer,
                        { backgroundColor: c.card, borderColor: c.border },
                      ]}
                    >
                      <DateTimePicker
                        value={fromDateString(
                          value || toDateString(new Date()),
                        )}
                        mode="date"
                        display="spinner"
                        textColor={c.text}
                        themeVariant={c.text === "#f9fafb" ? "dark" : "light"}
                        onChange={(
                          event: DateTimePickerEvent,
                          selected?: Date,
                        ) => {
                          if (selected) {
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
                      onChange={(
                        event: DateTimePickerEvent,
                        selected?: Date,
                      ) => {
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

          {/* Actions at the bottom */}
          <View style={styles.actionsContainer}>
            {/* Save Changes Button */}
            <Pressable
              style={[
                styles.save,
                { backgroundColor: c.primary, borderColor: c.border },
              ]}
              onPress={handleSave}
              accessibilityRole="button"
            >
              <Text style={[styles.saveText, { color: c.text }]}>
                Save Changes
              </Text>
            </Pressable>

            {/* Delete Tracker Data Button */}
            <Pressable
              style={[styles.deleteButton, { borderColor: c.danger }]}
              onPress={() => setShowDeleteModal(true)}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={20} color={c.danger} />
              <Text style={[styles.deleteButtonText, { color: c.danger }]}>
                Delete Tracker Data
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Delete Confirmation Modal (exact modal reused from ID screen) */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDeleteModal(false)}
        >
          <Pressable
            style={[
              styles.modalCard,
              { backgroundColor: c.card, borderColor: c.cardBorder },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={24} color={c.danger} />
              <Text style={[styles.modalTitle, { color: c.text }]}>
                Delete Tracker Data?
              </Text>
            </View>

            <Text style={[styles.modalMessage, { color: c.muted }]}>
              Are you sure? This will remove this tracker from your active
              trackers and clear your local data for it. This will not delete
              the tracker from being used again.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.modalButton,
                  { borderColor: c.border, backgroundColor: "transparent" },
                ]}
                onPress={() => setShowDeleteModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={[styles.modalButtonText, { color: c.text }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButton,
                  { borderColor: c.danger, backgroundColor: c.danger },
                ]}
                onPress={onDelete}
                accessibilityRole="button"
                accessibilityLabel="Confirm delete"
              >
                <Text style={[styles.modalButtonText, { color: "#ffffff" }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: "600",
  },
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
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  save: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
