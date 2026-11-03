// Purpose: Unit tests for the trackerSchema.

import {
  trackerSchema,
  type AddTrackerFormValues,
} from "@/utils/trackerSchema";

const valid: AddTrackerFormValues = {
  name: "Sleep Tracker",
  category: "Physical Health",
  type: "Tracker",
  frequency: "Daily",
  by: "By color",
  date: "2026-11-02",
  goal: "90",
  icon: "moon-outline",
  active: true,
  notes: "Sleep 8 hours nightly.",
};

// Extracts the error message for one field, or undefined if that field is valid
function errorFor(
  values: AddTrackerFormValues,
  field: keyof AddTrackerFormValues,
) {
  const result = trackerSchema.safeParse(values);
  return result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("trackerSchema", () => {
  // Name blank test
  test("requires a name", () => {
    // Arrange
    const values = { ...valid, name: "" };
    // Act
    const message = errorFor(values, "name");
    // Assert
    expect(message).toBe("Tracker Name is required.");
    expect(errorFor(values, "category")).toBeUndefined();
  });

  // Name length test
  test("requires at least 2 characters in the name", () => {
    expect(errorFor({ ...valid, name: "S" }, "name")).toBe(
      "Tracker Name must be at least 2 characters.",
    );
  });

  // Form test
  test("accepts a valid form", () => {
    const result = trackerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  // Goal inside edge tests
  test.each(["1", "100"])("accepts goal %p (the edges)", (goal) => {
    expect(errorFor({ ...valid, goal }, "goal")).toBeUndefined();
  });

  // Goal outside edge tests
  test.each([
    ["0", "Goal must be between 1 and 100."],
    ["101", "Goal must be between 1 and 100."],
    ["4.5", "Goal must be a whole number."],
  ])("rejects goal %p", (goal, message) => {
    expect(errorFor({ ...valid, goal }, "goal")).toBe(message);
  });

  // Extra test to fix for the commit fix requirement
  test("requires a category", () => {
    const values = { ...valid, category: "" };
    expect(errorFor(values, "category")).toBe("Category is required.");
  });
});
