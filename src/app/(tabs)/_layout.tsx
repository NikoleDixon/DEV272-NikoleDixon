// Purpose: Tabs layout (bottom).

import ThemeToggle from "@/components/ThemeToggle";
import { usePalette } from "@/hooks/usePalette";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

export default function TabLayout() {
    const c = usePalette();

    return (
        <Tabs screenOptions={{ headerRight: () => <ThemeToggle /> }} >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Search Trackers",
                    headerTitle: () => (
                        <View style={{ 
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "center" 
                            }}>
                            <Image
                                source={require("@/assets/images/HBJlogo.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ 
                                color: c.text, 
                                fontSize: 18, 
                                fontWeight: "600", 
                                padding: 10 }}>
                                Hummingbird Bullet Journal
                            </Text>
                        </View>
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
                        <View style={{ 
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "center" 
                            }}>
                            <Image
                                source={require("@/assets/images/HBJlogo.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ 
                                color: c.text, 
                                fontSize: 18, 
                                fontWeight: "600", 
                                padding: 10 }}>
                                Hummingbird Bullet Journal
                            </Text>
                        </View>
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