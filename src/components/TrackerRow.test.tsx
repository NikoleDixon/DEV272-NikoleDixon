import type { Tracker } from "@/api/trackers";
import { YourTrackersProvider } from "@/context/YourTrackersContext";
import { userEvent } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import { renderRouter, screen } from "expo-router/testing-library";
import type { ReactNode } from "react";
import { Text } from "react-native";
import { TrackerRow } from "./TrackerRow";

// Stands in for the real detail screen: shows which id the route received.
function DetailStub() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>Detail for {id}</Text>;
}

function Wrapper({ children }: { children: ReactNode }) {
  return <YourTrackersProvider>{children}</YourTrackersProvider>;
}

describe("TrackerRow", () => {
  const tracker: Tracker = {
    id: "2",
    name: "Sleep Tracker",
    category: "Physical Health",
    type: "Tracker",
    frequency: "Daily",
    by: "By color",
    date: "2026-11-02",
    goal: 90,
    icon: "moon-outline",
    active: true,
    notes: "Sleep 8 hours nightly.",
  };

  test("renders tracker text & navigates to the detail route when pressed", async () => {
    const user = userEvent.setup();

    await renderRouter(
      {
        index: () => <TrackerRow tracker={tracker} />,
        "trackers/[id]": DetailStub,
      },
      { initialUrl: "/", wrapper: Wrapper },
    );

    // Name is on screen
    expect(await screen.findByText("Sleep Tracker")).toBeOnTheScreen();
    expect(screen.getByText("Daily")).toBeOnTheScreen();

    // Press the row
    await user.press(screen.getByText("Sleep Tracker"));

    // Navigates to detail and passes the correct id
    expect(await screen.findByText("Detail for 2")).toBeOnTheScreen();
  });
});
