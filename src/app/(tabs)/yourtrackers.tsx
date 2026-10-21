// Purpose: List of Trackers selected and actively using. This can change by user and by month and updated by the user.

import { TrackerRow } from "@/components/TrackerRow";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { usePalette } from "@/hooks/usePalette";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function YourTrackers() {
    const c = usePalette();
    const { yourtrackers } = useYourTrackers();
    const yourTrackers = yourtrackers;

    // When there are no trackers active/in use in the Your Trackers tab. It desplays error and how to correct.
    if (yourTrackers.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={{ color: c.muted }}>
                    You have not selected any Trackers to use yet.
                </Text>
                <Text style={{ color: c.muted }}>
                    Tap Search Trackers to add one.
                </Text>
            </View>
        );
    }

    // Shows the list of trackers that are selected as active/in use.
    return (
        <FlatList
            data={yourTrackers}
            keyExtractor={(t) => t.id}
            renderItem={({ item }) => <TrackerRow tracker={item}  />}
            contentContainerStyle={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    list: {
        padding: 16,
        gap: 8,
    },
})