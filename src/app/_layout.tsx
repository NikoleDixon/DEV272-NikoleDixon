import { Stack } from "expo-router";

// Root layout. Every screen file inside src/app/ is a route.
// Week 3 replaces this with Stack + Tabs layouts.
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "DEV 272" }} />
    </Stack>
  );
}
