import { supabase } from "@/lib/supabase";

export type Tracker = {
  id: string;
  created_at?: string;
  name: string;
  category: string;
  type: string;
  date: string;
  goal: number;
  icon: string;
  active: boolean;
  notes: string;
};

export type NewTracker = Omit<Tracker, "id" | "created_at">;

export async function fetchTrackers(): Promise<Tracker[]> {
  const { data, error } = await supabase
    .from("trackers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchTracker(id: string): Promise<Tracker | null> {
  const { data, error } = await supabase
    .from("trackers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createTrackers(input: NewTracker): Promise<Tracker> {
  const { data, error } = await supabase
    .from("trackers")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}
