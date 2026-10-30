// Purpose: Individual Tracker view. Shows all data for tracker selected.
// Issue: The tabs are not showing at the bottom.
// Issue: the light/dark toggle is not showing.
// Future: add in by day tracking with modal/other for different options

import { ErrorView, LoadingView } from "@/components/StatusViews";
import ThemeToggle from "@/components/ThemeToggle";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { usePalette } from "@/hooks/usePalette";
import { useTracker } from "@/hooks/useTrackers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TrackerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = usePalette();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { yourtrackers, toggleTracker, setTrackerActive } = useYourTrackers();
  const { data: tracker, isPending, isError, error, refetch } = useTracker(id);

  if (isPending) return <LoadingView />;

  if (isError)
    return <ErrorView message={error.message} onRetry={() => refetch()} />;

  if (!tracker) {
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
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={26} color={c.text} />
          </Pressable>
        </View>
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
      </View>
    );
  }

  const isActive = yourtrackers.includes(tracker.id);

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
            {tracker.name}
          </Text>
        </View>

        <ThemeToggle style={{ marginRight: 0 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.screen}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: c.card, borderColor: c.cardBorder },
          ]}
        >
          {/* Header with badges on left, edit & delete buttons on right */}
          <View style={styles.header}>
            <View style={styles.badgeGroup}>
              <View style={[styles.badge, { backgroundColor: c.primary }]}>
                <Text style={[styles.badgeText, { color: c.text }]}>
                  {tracker.type}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isActive ? c.primary : c.muted },
                ]}
              >
                <Text style={[styles.badgeText, { color: c.text }]}>
                  {isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>

            <View style={styles.actionGroup}>
              <Pressable
                onPress={() => {
                  // Functionality to be added later
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Edit tracker"
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Ionicons name="pencil-outline" size={20} color={c.text} />
              </Pressable>

              <Pressable
                onPress={() => setShowDeleteModal(true)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Delete tracker data"
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Ionicons name="trash-outline" size={20} color={c.danger} />
              </Pressable>
            </View>
          </View>

          {/* Active Tracker Switch */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: c.text }]}>
              Active Tracker
            </Text>
            <Switch
              value={isActive}
              onValueChange={() => toggleTracker(tracker.id)}
              trackColor={{ false: c.border, true: c.primary }}
              accessibilityLabel="Active Tracker Switch"
            />
          </View>

          {/* Tracker Information with frequency, category, by, date, goal and notes */}
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-number-outline"
              size={18}
              color={c.muted}
            />
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

          <View style={styles.infoRow}>
            {tracker.date ? (
              <>
                <Ionicons name="calendar-outline" size={18} color={c.muted} />
                <Text style={[styles.infoText, { color: c.muted }]}>
                  {tracker.date}
                </Text>
              </>
            ) : null}

            {tracker.goal !== undefined ? (
              <>
                <Ionicons name="flag-outline" size={18} color={c.muted} />
                <Text style={[styles.infoText, { color: c.muted }]}>
                  Goal: {tracker.goal}%
                </Text>
              </>
            ) : null}
          </View>

          <View style={[styles.divider, { backgroundColor: c.cardBorder }]} />

          {tracker.notes && (
            <Text style={[styles.notes, { color: c.text }]}>
              Notes: {tracker.notes}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
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
              Are you sure? This will remove this tracker from your active trackers and clear your local data for it. This will not delete the tracker from Supabase.
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
                onPress={() => {
                  setTrackerActive(tracker.id, false);
                  setShowDeleteModal(false);
                  router.back();
                }}
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
  container: {
    flex: 1,
  },
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
  screen: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 15,
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
  badgeGroup: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
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
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: "600",
  },
  name: {
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
