import { TrackerRow } from "@/compenents/TrackerRow";
import { colors, Palette } from "@/constants/colors";
import { trackers } from "@/data/trackers";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View
} from "react-native";

export default function Index() {
  const [query, setQuery] = useState<string>("");
  const q = query.trim().toLowerCase();
  const filtered = trackers.filter(
    (t) =>
    t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
  );
  const c = colors[useColorScheme() === "dark" ? "dark" : "light"]

  return (
    <FlatList 
      data={filtered}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TrackerRow tracker={item} />}
      ListHeaderComponent={
        <Header c={c} query={query} onChangeQuery={setQuery} />
      }
      contentContainerStyle={styles.list}
    />
  );
}

type HeaderProps = {
  query:string;
  onChangeQuery: (text: string) => void;
  c: Palette;
}

function Header({ query, onChangeQuery, c}: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: c.text }]}>
        Trackers you can choose to use.
      </Text>
      <View style={styles.row}>
        <TextInput
          style={[
            styles.input, 
            { borderColor: c.primary, color: c.text, backgroundColor: c.card, borderWidth: 0.5, },
          ]}
          placeholder="Search trackers"
          placeholderTextColor={c.muted}
          value={query}
          onChangeText={onChangeQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Pressable
          style={[styles.button, { backgroundColor: c.primary, borderColor: c.text, borderWidth: 0.5,}]}
          onPress={() => onChangeQuery("")}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
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
  row: { flexDirection: "row", gap: 8, alignItems: "center"},
    input:{
      flex: 1,
      borderWidth:1,
      borderRadius: 8,
      padding: 10,
    },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "600",
  },
});
