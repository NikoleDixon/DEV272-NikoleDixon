// Purpose: Search Trackers (onType). Shows some data for trackers. Can select different trackers to view full data. 

import { TrackerRow } from "@/components/TrackerRow";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { Tracker } from "@/data/trackers";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function Index() {
  const [query, setQuery] = useState<string>("");
  const { trackers } = useYourTrackers();
  const q = query.trim().toLowerCase();
  const filtered = (trackers ?? []).filter(
    (t: Tracker) =>
      t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
  );
  const c = usePalette();

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <FlatList 
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TrackerRow tracker={item} />}
        ListHeaderComponent={
          <Header query={query} onChangeQuery={setQuery} />
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
  query:string;
  onChangeQuery: (text: string) => void;
}

function Header({ query, onChangeQuery}: HeaderProps) {
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
          style={[styles.button, { 
            backgroundColor: c.primary, 

            }]}
          onPress={() => onChangeQuery("")}
        >
          <Text style={[styles.buttonText, { color: c.text }]}>Clear</Text>
        </Pressable>
      </View>
      <Text style={{ color: c.muted}}>
         {query ? `Matching "${query}"` : "All Trackers"}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: { 
    padding:15,
    gap: 8,
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
    alignItems: "center"
  },
  input:{
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