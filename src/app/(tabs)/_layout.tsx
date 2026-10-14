import ThemeToggle from "@/compenents/ThemeToggle";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabLayout() {
    const c = usePalette();

    return (
        <Tabs screenOptions={{ headerRight: () => <ThemeToggle /> }} >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Search Trackers",
                    headerTitle: () => (
                        <Image
                            source={require("@/assets/images/HBJlogo.png")}
                            style={{ width: 30, height: 30 }}
                        />
                    ),
                    headerTitleStyle: { color: c.text },
                    headerStyle: { backgroundColor: c.card },
                    tabBarActiveTintColor: c.text,
                    tabBarActiveBackgroundColor: c.primary,
                    tabBarInactiveBackgroundColor: c.card,
                    tabBarIcon: ({ size }) => (
                        <Ionicons name="list-outline" color={c.text} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="yourtrackers"
                options={{
                    title: "Your Trackers",
                    headerTitle: () => (
                        <Image
                            source={require("@/assets/images/HBJlogo.png")}
                            style={{ width: 30, height: 30 }}
                        />
                    ),
                    headerTitleStyle: { color: c.text },
                    headerStyle: { backgroundColor: c.card },
                    tabBarActiveTintColor: c.text,         
                    tabBarActiveBackgroundColor: c.primary,
                    tabBarInactiveBackgroundColor: c.card,         
                    tabBarIcon: ({ size}) => (
                        <Ionicons name="checkbox-outline" color={c.text} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}