import { YourTrackersProvider } from "@/context/YourTrackersContext";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const scheme = useColorScheme()
  
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <YourTrackersProvider>
        <StatusBar style="auto"/>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{
              headerShown: false }} />
          <Stack.Screen 
            name="trackers/[id]" 
            options={{ 
              title: "Hummingbird Bullet Journal", 
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
      </YourTrackersProvider>
    </ThemeProvider>
  );
}
//