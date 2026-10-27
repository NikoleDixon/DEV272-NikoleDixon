// Purpose: Search Trackers (onType). Shows some data for trackers. Can select different trackers to view full data. 

import { ErrorView, LoadingView } from "@/components/StatusViews";
import { TrackerRow } from "@/components/TrackerRow";
import { usePalette } from "@/hooks/usePalette";
import { useTrackers } from "@/hooks/useTrackers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const c = usePalette();

  const {
    data: trackers,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTrackers();

  const q = query.trim().toLowerCase();
  const filtered = trackers?.filter(
    (t) =>
      t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
  );

  if (isPending) return <LoadingView />;

  if (isError) 
    return <ErrorView message={error.message} onRetry={() => refetch()} />;

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <FlatList 
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TrackerRow tracker={item} />}
        ListHeaderComponent={
          <Header query={query} onChangeQuery={setQuery} />
        }
        ListEmptyComponent={
          <View style={[styles.center, { padding: 32 }]}>
            <Ionicons name="file-tray-outline" size={40} color={c.muted} />
            <Text style={{ color: c.muted, marginTop: 8, fontSize: 16 }}>
              {q ? `No trackers match "${query}".` : "No trackers found."}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
        contentContainerStyle={styles.list}
      />
      <Pressable
        onPress={() => router.push("/add")}
        accessibilityRole="button"
        accessibilityLabel="Add Tracker"
        style={({ pressed }) => [
          styles.add,
          { backgroundColor: c.primary, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name={"add-outline"} size={30} color={c.text}/>
      </Pressable>
    </View>
  );
}

type HeaderProps = {
  query: string;
  onChangeQuery: (text: string) => void;
};

function Header({ query, onChangeQuery }: HeaderProps) {
  const c = usePalette();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: c.text }]}>
        Trackers you can choose to use.
      </Text>
      <View style={styles.row}>
        <TextInput
          style={[
            styles.input, 
            { borderColor: c.primary, 
              color: c.text, 
              backgroundColor: c.card, 
            },
          ]}
          placeholder="Search trackers"
          placeholderTextColor={c.muted}
          value={query}
          onChangeText={onChangeQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Pressable
          style={[styles.button, { backgroundColor: c.primary }]}
          onPress={() => onChangeQuery("")}
        >
          <Text style={[styles.buttonText, { color: c.text }]}>Clear</Text>
        </Pressable>
      </View>
      <Text style={{ color: c.muted }}>
         {query ? `Matching "${query}"` : "All Trackers"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  errorMessage: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  list: { 
    padding: 15,
    gap: 8,
  },
  empty: {
    textAlign: "center",
    paddingVertical: 24,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  row: { 
    flexDirection: "row", 
    gap: 8, 
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    borderWidth: 0.5,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  buttonText: { 
    fontWeight: "600",
  },
  add: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 45,
    height: 45,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 6 },
    }),
  },
});