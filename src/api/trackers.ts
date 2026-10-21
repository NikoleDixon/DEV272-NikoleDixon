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

// src/api/trackers.ts
// import { supabase } from "@/lib/supabase";
// import { useEffect } from "react";

// export type Tracker = {
//   id: string;
//   created_at: string;
//   name: string;
//   category: string;
//   type: string;
//   frequency: string;
//   by: string;
//   date: string;
//   icon: string;
//   active: boolean;
//   notes: string;
// };

// export type NewTracker = Omit<Tracker, "id" | "created_at">;

// export async function fetchTrackers(): Promise<Tracker[]> {
//   const { data, error } = await supabase
//     .from("trackers")
//     .select("*")
//     .order("created_at", { ascending: false });
//   if (error) throw error;
//   return data;
// }

// export async function fetchTracker(id: string): Promise<Tracker | null> {
//   const { data, error } = await supabase.from("trackers").select("*").eq("id", id).maybeSingle();
//   if (error) throw error;
//   return data;
// }

// export async function createTrackers(input: NewTracker): Promise<Tracker> {
//   const { data, error } = await supabase.from("trackers").insert(input).select().single();
//   if (error) throw error;
//   return data;
// }

// // TEMPORARY smoke test: delete these lines once the terminal prints the count.
// fetchTrackers()
//   .then((rows) => console.log(rows.length, "trackers"))
//   .catch(console.error);

//   useEffect(() => {
//   fetchTrackers().then((rows) => console.log(rows.length, "trackers")).catch(console.error);
// }, []);