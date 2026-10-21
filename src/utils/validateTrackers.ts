export type AddTrackerForm = {
    name: string;
    category: string;
    type: string;
    frequency: string;
    by: string;
    date: string;
    icon: string;
    active: boolean;
    notes: string;
};


export type TrackerErrors = Partial<Record<keyof AddTrackerForm, string>>;

export const NOTES_MAX = 500;

export function validateTrackers(form: AddTrackerForm): TrackerErrors {
  const errors: TrackerErrors = {};

  const name = form.name.trim();
  if (!name) errors.name = "Tracker Name is required.";
  else if (name.length < 2) errors.name = "Tracker Name must be at least 5 characters.";

  if (!form.category.trim()) errors.category = "Category is required.";
  if (!form.type.trim()) errors.type = "Type is required.";
  if (!form.frequency.trim()) errors.frequency = "Frequency is required.";
  if (!form.by.trim()) errors.by = "By is required.";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
    errors.date = "Date is required.";
    } else {
    const [y, m, d] = form.date.split("-").map(Number);
    const parsed = new Date(y, m - 1, d);
    if (
        parsed.getFullYear() !== y ||
        parsed.getMonth() !== m - 1 ||
        parsed.getDate() !== d
    ) {
        errors.date = "Enter a valid date.";
    }
    }

  if (form.notes.length > NOTES_MAX)
    errors.notes = `Notes must be ${NOTES_MAX} characters or fewer.`;

  return errors;
}