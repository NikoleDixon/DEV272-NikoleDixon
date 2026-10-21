// Purpose: Stack for main set up??

import { YourTrackersProvider } from "@/context/YourTrackersContext";
// import { QueryClient } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

// const queryClient = new queryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 60 * 1000,   // data is "fresh" for a minute; no refetch on remount during that window
//       retry: 1,               // one retry on failure before showing the error
//     },
//   },
// });

export default function RootLayout() {
  const scheme = useColorScheme()
  
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <QueryClientProvider client={queryClient}> */}
      <YourTrackersProvider>
        <StatusBar style="auto"/>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="trackers/[id]" 
            options={{ 
              title: "Hummingbird Bullet Journal", 
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <Stack.Screen 
            name="add" 
            options={{ 
              title: "New tracker", 
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
      </YourTrackersProvider>
      {/* </QueryClientProvider> */}
    </ThemeProvider>
  );
}