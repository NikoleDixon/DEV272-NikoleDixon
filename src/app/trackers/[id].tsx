// Purpose: Individual Tracker view. Shows all data for tracker selected.
// Issue: the light/dark toggle is not showing - andoid.
// Future: add in by day tracking with modal/other for different options - more work needs to be added

import { ErrorView, LoadingView } from "@/components/StatusViews";
import ThemeToggle from "@/components/ThemeToggle";
import { TrackerMonthView } from "@/components/TrackerMonthView";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { usePalette } from "@/hooks/usePalette";
import { useTracker } from "@/hooks/useTrackers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
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
  const [viewTab, setViewTab] = useState<"year" | "month" | "week">("month");
  const { yourtrackers, toggleTracker, getEffectiveTracker } =
    useYourTrackers();
  const {
    data: rawTracker,
    isPending,
    isError,
    error,
    refetch,
  } = useTracker(id);
  const tracker = rawTracker ? getEffectiveTracker(rawTracker) : null;

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
          {/* Header with badges on left, edit button on right */}
          <View style={styles.header}>
            <View style={styles.badgeGroup}>
              {/* Type Badge */}
              <View style={[styles.badge, { backgroundColor: c.primary }]}>
                <Text style={[styles.badgeText, { color: c.background }]}>
                  {tracker.type}
                </Text>
              </View>

              {/* Category Badge with Icon */}
              {tracker.category ? (
                <View style={[styles.badge, { backgroundColor: c.primary }]}>
                  <Ionicons
                    name="medkit-outline"
                    size={14}
                    color={c.background}
                  />
                  <Text style={[styles.badgeText, { color: c.background }]}>
                    {tracker.category}
                  </Text>
                </View>
              ) : null}

              {/* Active/Inactive Badge */}
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isActive ? c.primary : c.muted },
                ]}
              >
                <Text style={[styles.badgeText, { color: c.background }]}>
                  {isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>

            <View style={styles.action}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/trackers/edit",
                    params: { id: tracker.id },
                  })
                }
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Edit tracker"
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Ionicons name="create-outline" size={20} color={c.text} />
              </Pressable>
            </View>
          </View>

          {/* Date & Goal Info Row*/}
          {(tracker.date || tracker.goal !== undefined) && (
            <View style={styles.infoRow}>
              {tracker.date ? (
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={16} color={c.muted} />
                  <Text style={[styles.infoText, { color: c.muted }]}>
                    {tracker.date}
                  </Text>
                </View>
              ) : null}

              {tracker.goal !== undefined ? (
                <View style={styles.infoItem}>
                  <Ionicons name="flag-outline" size={16} color={c.muted} />
                  <Text style={[styles.infoText, { color: c.muted }]}>
                    Goal: {tracker.goal}%
                  </Text>
                </View>
              ) : null}
            </View>
          )}

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

          {tracker.notes ? (
            <Text style={[styles.notes, { color: c.text }]}>
              Notes: {tracker.notes}
            </Text>
          ) : null}

          {/* 3 Tabs: Year | Month | Week */}
          <View style={[styles.tabBar, { borderBottomColor: c.border }]}>
            {(["year", "month", "week"] as const).map((tab) => {
              const isActiveTab = viewTab === tab;
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              return (
                <Pressable
                  key={tab}
                  style={[
                    styles.tabButton,
                    isActiveTab && {
                      backgroundColor: c.primary,
                    },
                  ]}
                  onPress={() => setViewTab(tab)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActiveTab }}
                  accessibilityLabel={`${label} view`}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActiveTab ? "#ffffff" : c.muted,
                        fontWeight: isActiveTab ? "700" : "500",
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Tab Content */}
          {viewTab === "month" && <TrackerMonthView trackerId={tracker.id} />}

          {viewTab === "year" && (
            <View style={styles.placeholderView}>
              <Ionicons name="calendar-outline" size={36} color={c.primary} />
              <Text style={[styles.placeholderTitle, { color: c.text }]}>
                Year View
              </Text>
              <Text style={[styles.placeholderText, { color: c.muted }]}>
                Full-year tracking under construction.
              </Text>
            </View>
          )}

          {viewTab === "week" && (
            <View style={styles.placeholderView}>
              <Ionicons
                name="calendar-number-outline"
                size={36}
                color={c.primary}
              />
              <Text style={[styles.placeholderTitle, { color: c.text }]}>
                Week View
              </Text>
              <Text style={[styles.placeholderText, { color: c.muted }]}>
                Weekly habit breakdown under construction.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    flex: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
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
    gap: 16,
    paddingVertical: 2,
  },
  infoItem: {
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
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 4,
    marginBottom: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 15,
  },
  placeholderView: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  placeholderText: {
    fontSize: 14,
    textAlign: "center",
  },
});
