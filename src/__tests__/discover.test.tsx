// Purpose: Screen tests for the Discover screen.

import * as api from "@/api/trackers";
import DiscoverScreen from "@/app/(tabs)/discover";
import { YourTrackersProvider } from "@/context/YourTrackersContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react-native";
import { renderRouter, screen } from "expo-router/testing-library";
import type { ReactNode } from "react";

// Mock the API layer so tests run in with no Supabase calls
jest.mock("@/api/trackers");
const mockedApi = jest.mocked(api);

// Mock API data
const mockTrackers: api.Tracker[] = [
  {
    id: "1",
    name: "Sleep Tracker",
    category: "Physical Health",
    type: "Tracker",
    date: "2026-11-02",
    goal: 90,
    icon: "moon-outline",
    active: true,
    notes: "Sleep 8 hours nightly.",
  },
  {
    id: "2",
    name: "Water",
    category: "Physical Health",
    type: "Tracker",
    date: "2026-11-02",
    goal: 80,
    icon: "water-outline",
    active: false,
    notes: "Drink all day.",
  },
];

// Query client for tests with retry set to false, avoids timeout
function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

// Your Tracker Provider wrapper
function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={makeTestQueryClient()}>
      <YourTrackersProvider>{children}</YourTrackersProvider>
    </QueryClientProvider>
  );
}

describe("Discover Screen", () => {
  // Clear any previous mock results to avoid cross-test leaks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. renders the list of mocked items", async () => {
    // Fake API to return our 2 mock items when called
    mockedApi.fetchTrackers.mockResolvedValue(mockTrackers);

    // Render the DiscoverScreen inside Expo Router's test environment
    await renderRouter(
      {
        index: DiscoverScreen,
        "trackers/[id]": () => null,
      },
      { initialUrl: "/", wrapper: Providers },
    );

    // Wait for data to resolve and appear on screen
    expect(await screen.findByText("Sleep Tracker")).toBeOnTheScreen();
    expect(screen.getByText("Water")).toBeOnTheScreen();
  });

  test("2. filters the list when the user types in the search field", async () => {
    mockedApi.fetchTrackers.mockResolvedValue(mockTrackers);

    await renderRouter(
      {
        index: DiscoverScreen,
        "trackers/[id]": () => null,
      },
      { initialUrl: "/", wrapper: Providers },
    );

    // Ensure items are initially rendered
    expect(await screen.findByText("Sleep Tracker")).toBeOnTheScreen();
    expect(screen.getByText("Water")).toBeOnTheScreen();

    // Type "Sleep" into the search box
    await fireEvent.changeText(
      screen.getByPlaceholderText("Search trackers"),
      "Sleep",
    );

    // "Sleep Tracker" should remain; "Water" should be filtered out
    expect(screen.getByText("Sleep Tracker")).toBeOnTheScreen();
    expect(screen.queryByText("Water")).toBeNull();
  });

  test("3. shows the error state (and retry) when the API rejects", async () => {
    // Fake API to fail by returning a rejected Promise
    mockedApi.fetchTrackers.mockRejectedValue(
      new Error("Failed to load trackers"),
    );

    // Mount the screen
    await renderRouter(
      {
        index: DiscoverScreen,
        "trackers/[id]": () => null,
      },
      { initialUrl: "/", wrapper: Providers },
    );

    // Error message and "Try again" retry button should be rendered
    expect(
      await screen.findByText("Failed to load trackers"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Try again")).toBeOnTheScreen();
  });
});
