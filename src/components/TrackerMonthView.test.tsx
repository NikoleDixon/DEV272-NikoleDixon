import { TrackerMonthView } from "@/components/TrackerMonthView";
import { userEvent } from "@testing-library/react-native";
import { renderRouter, screen } from "expo-router/testing-library";

describe("TrackerMonthView", () => {
  test("renders legend collapsed by default, expands on press, and renders calendar", async () => {
    const user = userEvent.setup();

    await renderRouter(
      {
        index: () => (
          <TrackerMonthView trackerId="test-tracker" initialDate="2026-10-15" />
        ),
      },
      { initialUrl: "/" },
    );

    // Legend header is visible
    expect(await screen.findByText("Legend")).toBeOnTheScreen();

    // Collapsed by default (expand button is present)
    const expandButton = screen.getByLabelText("Expand legend");
    expect(expandButton).toBeOnTheScreen();
    expect(screen.queryByText("Sad")).toBeNull();

    // Press expand button
    await user.press(expandButton);

    // Mood items appear
    expect(await screen.findByText("Sad")).toBeOnTheScreen();
    expect(screen.getByText("Happy")).toBeOnTheScreen();
    expect(screen.getByText("Ok")).toBeOnTheScreen();

    // Weekday headers & month / year navigation
    expect(screen.getByText("OCTOBER")).toBeOnTheScreen();
    expect(screen.getByText("2026")).toBeOnTheScreen();
    expect(screen.getAllByText("S").length).toBeGreaterThanOrEqual(2);
  });
});
