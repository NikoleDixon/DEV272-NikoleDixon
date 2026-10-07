import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Tracker, trackers } from "./data/trackers";

export default function Index() {
  return (
    <FlatList 
      data={trackers}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TrackerRow tracker={item} />}
      ListHeaderComponent={<Header />}
      contentContainerStyle={styles.list}
    />
  );
}

function Header() {
  const [query, setQuery] = useState<string>("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bullet Journal</Text>
      <View style={styles.row}>
        <TextInput 
          style ={styles.input} 
          placeholder="Search Trackers"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Pressable style={styles.button} onPress={() => console.log("Search")}>
          <Text style={styles.buttonText}>Go</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TrackerRow({tracker}: {tracker: Tracker}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        <Text style={styles.cardTitle}>{tracker.name}</Text>
        <Text style={styles.cardSub}>{tracker.type}</Text>
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
},
cardMain: { flex: 1, gap: 2 },
cardTitle: { fontWeight: "600" },
cardSub: { color: "#6b7280" },
});
