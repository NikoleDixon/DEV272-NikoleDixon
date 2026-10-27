// Purpose: Context managing the user's active/selected trackers (persisted across restarts via AsyncStorage)

import { loadJson, saveJson, STORAGE_KEYS } from "@/lib/storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type YourTrackersContextValue = {
  yourtrackers: string[];
  toggleTracker: (id: string) => void;
  setTrackerActive: (id: string, active: boolean) => void;
};

const YourTrackersContext = createContext<YourTrackersContextValue | null>(null);

export function YourTrackersProvider({ children }: { children: ReactNode }) {
  const [yourtrackers, setYourTrackers] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 1. Hydrate on mount: load saved tracker IDs from AsyncStorage when the app opens
  useEffect(() => {
    loadJson<string[]>(STORAGE_KEYS.yourTrackers, []).then((stored) => {
      setYourTrackers(stored);
      setHydrated(true); // mark as hydrated so we know storage has finished loading
    });
  }, []);

  // 2. Save on change: automatically save to AsyncStorage whenever yourtrackers changes
  // The "hydrated" guard ensures we don't accidentally overwrite storage before load finishes
  useEffect(() => {
    if (!hydrated) return;
    saveJson(STORAGE_KEYS.yourTrackers, yourtrackers);
  }, [yourtrackers, hydrated]);

  // Toggle a tracker in/out of the user's active list
  const toggleTracker = (id: string) => {
    setYourTrackers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
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

  return (
    <YourTrackersContext.Provider value={{ yourtrackers, toggleTracker, setTrackerActive }}>
      {children}
    </YourTrackersContext.Provider>
  );
}

export function useYourTrackers() {
  const ctx = useContext(YourTrackersContext);
  if (!ctx) throw new Error("useYourTrackers must be used inside YourTrackersProvider");
  return ctx;
}
