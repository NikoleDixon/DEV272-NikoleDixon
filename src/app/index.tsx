import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";
import { colors, Palette } from "./constants/colors";
import { Tracker, trackers } from "./data/trackers";

export default function Index() {
  const c= colors[useColorScheme() === "dark" ? "dark" : "light"];
  const [query, setQuery] = useState<string>("");
  const filtered = trackers.filter((t) =>
    t.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <FlatList 
      data={filtered}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TrackerRow tracker={item} c={c} />}
      ListHeaderComponent={<Header c={c} query={query} setQuery={setQuery} />}
      contentContainerStyle={styles.list}
    />
  );
}

function Header({
  c, query, setQuery,}: { c: Palette; query: string; setQuery: (text: string) => void;}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: c.text }]}>
        Trackers you can choose to use.
      </Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          placeholder="Search trackers"
          placeholderTextColor={c.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Pressable
          style={[styles.button, { backgroundColor: c.primary }]}
          onPress={() => console.log("search:", query)}
        >
          <Text style={styles.buttonText}>Go</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TrackerRow({ tracker, c }: { tracker: Tracker, c: Palette }) {
  
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.cardBorder },
      ]}
    >
      <View style={styles.cardMain}>
        <Text style={[styles.cardTitle, { color: c.text }]}>
          {tracker.name}
        </Text>
        <Text style={{ color: c.muted }}>{tracker.type}</Text>
      </View>
       <Text style={styles.cardSub}>{tracker.frequency}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { 
    padding:15,
    gap: 8,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  row: { flexDirection: "row", gap: 8, alignItems: "center"},
    input:{
      flex: 1,
      borderWidth:1,
      borderColor: "#9ca3af",
      borderRadius: 8,
      padding: 10,
    },
  body: {
    fontSize: 16,
    textAlign: "center",
  },
button: {
  backgroundColor: "#2563eb",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8,
},
buttonText: { 
  color: "#fff", 
  fontWeight: "600",
},
card: {
  padding: 12,
  borderRadius: 8,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  ...Platform.select({
    ios: { 
      shadowColor: "#000",
      shadowOpacity: 0.1, 
      shadowRadius: 4 ,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { 
      elevation: 2 },
  })
},
cardMain: {flex: 1, gap: 2},
cardTitle: {fontWeight: "600"},
cardSub: {color: "#6b7280"},
});
