// Purpose: Filtering trackers when there is a search preformed

import { trackers as sTrackers, type Tracker, } from "@/data/trackers";
import { createContext, useContext, useState, type ReactNode } from "react";

type YourTrackersContextValue = {
  yourtrackers: Tracker[];
  trackers: Tracker[];
  add: (tracker: Tracker) => void;
};
 
const YourTrackersContext = createContext<YourTrackersContextValue | null>(null);

export function YourTrackersProvider({ children }: { children: ReactNode }) {
  const [yourtrackers, setYourTrackers] = useState<Tracker[]>(sTrackers);

  const add = (tracker: Tracker) =>
    setYourTrackers((current) => [tracker, ...current]);

  return (
    <YourTrackersContext.Provider value={{ yourtrackers, trackers: yourtrackers, add }}>
      {children}
    </YourTrackersContext.Provider>
  );
}
 
export function useYourTrackers() {
  const ctx = useContext(YourTrackersContext);
  if (!ctx) throw new Error("useYourTrackers must be used inside YourTrackersProvider");
  return ctx;
}
 