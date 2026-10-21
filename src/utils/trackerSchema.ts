import { z } from "zod";

export const NOTES_MAX = 500;
export const GOAL_MIN = 1;
export const GOAL_MAX = 100;

const isRealDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  const p = new Date(y, m - 1, d);
  return p.getFullYear() === y && p.getMonth() === m - 1 && p.getDate() === d;
};

export const trackerSchema = z.object({
  name: z.string().trim()
    .min(1, "Tracker Name is required.")
    .min(2, "Tracker Name must be at least 2 characters."),
    
  category: z.string().min(1, "Category is required."),
  type: z.string().min(1, "Type is required."),
  frequency: z.string().min(1, "Frequency is required."),
  by: z.string().min(1, "By is required."),

  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required.")
    .refine(isRealDate, "Enter a valid date."),

  goal: z.string().trim()
    .min(1, "Goal is required.")
    .refine((s) => /^\d+$/.test(s), "Goal must be a whole number.")
    .refine((s) => Number(s) >= GOAL_MIN && Number(s) <= GOAL_MAX,
      `Goal must be between ${GOAL_MIN} and ${GOAL_MAX}.`),

  icon: z.string(),
  active: z.boolean(),
  notes: z.string().max(NOTES_MAX, `Notes must be ${NOTES_MAX} characters or fewer.`),
});

export type AddTrackerFormValues = z.infer<typeof trackerSchema>;

export type TrackerData = z.output<typeof trackerSchema>;