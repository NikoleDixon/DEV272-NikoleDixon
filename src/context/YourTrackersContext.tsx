// Purpose: Context managing the user's active/selected trackers and personal edits (persisted across restarts via AsyncStorage)

import type { Tracker } from "@/api/trackers";
import { loadJson, saveJson, STORAGE_KEYS } from "@/lib/storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type YourTrackersContextValue = {
  yourtrackers: string[];
  toggleTracker: (id: string) => void;
  setTrackerActive: (id: string, active: boolean) => void;
  trackerOverrides: Record<string, Partial<Tracker>>;
  updateTrackerOverride: (id: string, updates: Partial<Tracker>) => void;
  deleteTrackerData: (id: string) => void;
  getEffectiveTracker: (tracker: Tracker) => Tracker;
};

const YourTrackersContext = createContext<YourTrackersContextValue | null>(
  null,
);

export function YourTrackersProvider({ children }: { children: ReactNode }) {
  const [yourtrackers, setYourTrackers] = useState<string[]>([]);
  const [trackerOverrides, setTrackerOverrides] = useState<
    Record<string, Partial<Tracker>>
  >({});
  const [hydrated, setHydrated] = useState(false);

  // 1. Hydrate on mount: load saved tracker IDs and overrides from AsyncStorage when the app opens
  useEffect(() => {
    Promise.all([
      loadJson<string[]>(STORAGE_KEYS.yourTrackers, []),
      loadJson<Record<string, Partial<Tracker>>>(
        STORAGE_KEYS.trackerOverrides,
        {},
      ),
    ]).then(([storedTrackers, storedOverrides]) => {
      setYourTrackers(storedTrackers);
      setTrackerOverrides(storedOverrides);
      setHydrated(true); // mark as hydrated so we know storage has finished loading
    });
  }, []);

  // 2. Save on change: automatically save to AsyncStorage whenever yourtrackers or overrides change
  useEffect(() => {
    if (!hydrated) return;
    saveJson(STORAGE_KEYS.yourTrackers, yourtrackers);
  }, [yourtrackers, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveJson(STORAGE_KEYS.trackerOverrides, trackerOverrides);
  }, [trackerOverrides, hydrated]);

  // Toggle a tracker in/out of the user's active list
  const toggleTracker = (id: string) => {
    setYourTrackers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  // Explicitly set a tracker as active or inactive
  const setTrackerActive = (id: string, active: boolean) => {
    setYourTrackers((current) => {
      if (active && !current.includes(id)) {
        return [...current, id];
      }
      if (!active && current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      return current;
    });
  };

  // Save personal edits to a tracker (client-side only, does not touch Supabase)
  const updateTrackerOverride = (id: string, updates: Partial<Tracker>) => {
    setTrackerOverrides((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? {}),
        ...updates,
      },
    }));
  };

  // Delete all personal data for a tracker (deactivate & wipe custom edits)
  const deleteTrackerData = (id: string) => {
    setYourTrackers((current) => current.filter((item) => item !== id));
    setTrackerOverrides((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  // Merge base tracker data with any personal overrides the user has saved
  const getEffectiveTracker = (tracker: Tracker): Tracker => {
    const override = trackerOverrides[tracker.id];
    if (!override) return tracker;
    return {
      ...tracker,
      ...override,
    };
  };

  return (
    <YourTrackersContext.Provider
      value={{
        yourtrackers,
        toggleTracker,
        setTrackerActive,
        trackerOverrides,
        updateTrackerOverride,
        deleteTrackerData,
        getEffectiveTracker,
      }}
    >
      {children}
    </YourTrackersContext.Provider>
  );
}

export function useYourTrackers() {
  const ctx = useContext(YourTrackersContext);
  if (!ctx)
    throw new Error("useYourTrackers must be used inside YourTrackersProvider");
  return ctx;
}
