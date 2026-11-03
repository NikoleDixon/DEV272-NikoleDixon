// Purpose: Home screen displaying user's selected/active trackers.

import { ErrorView, LoadingView } from "@/components/StatusViews";
import { TrackerRow } from "@/components/TrackerRow";
import { useYourTrackers } from "@/context/YourTrackersContext";
import { usePalette } from "@/hooks/usePalette";
import { useTrackers } from "@/hooks/useTrackers";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    const c = usePalette();
    const { yourtrackers } = useYourTrackers();

    const {
        data: trackers,
        isPending,
        isError,
        error,
        refetch,
    } = useTrackers();
    
    const yourTrackers = trackers?.filter((t) =>
        yourtrackers.includes(t.id),
  );

  if (isPending) return <LoadingView />;

  if (isError) 
    return <ErrorView message={error.message} onRetry={() => refetch()} />;


    // When there are no trackers active/in use in the Your Trackers tab. It desplays error and how to correct.
    if (yourTrackers?.length === 0) {
        return (
            <View style={[styles.empty, { backgroundColor: c.background }]}>
                <Text style={{ color: c.muted }}>
                    You have not selected any Trackers to use yet.
                </Text>
                <Text style={{ color: c.muted }}>
                    Tap Discover to add a tracker.
                </Text>
            </View>
        );
    }

    // Shows the list of trackers that are selected as active/in use.
    return (
        <FlatList
            style={{ backgroundColor: c.background }}
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