import ThemeToggle from "@/compenents/ThemeToggle";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {

    return (
        <Tabs screenOptions={{ headerRight: () => <ThemeToggle /> }} >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Search Trackers",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="yourtrackers"
                options={{
                    title: "Your Trackers",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="checkbox-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}
//