import ThemeToggle from "@/compenents/ThemeToggle";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const scheme = useColorScheme()
  
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto"/>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ title: "DEV 272", headerRight: () => <ThemeToggle/> }}
        />
      </Stack>
    </ThemeProvider>
  );
}
