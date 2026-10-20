import type { Tracker } from "@/data/trackers";

// What the form sends once it is valid: a tracker with no id yet.
// Whoever stores it creates the id.
export type NewTracker = Omit<Tracker, "id">;

const DELAY_MS = 1200;

// Simulated save. Nothing is stored. Week 5 replaces the body with a real request.
// Type "Fail" as the name to see the error path.
export async function saveTracker(
  input: NewTracker,
): Promise<Tracker> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  if (input.name.toLowerCase() === "fail") {
    throw new Error("Simulated network failure");
  }

  return { id: Date.now().toString(), ...input };
}