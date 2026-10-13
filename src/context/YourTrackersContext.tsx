import { createContext, useContext, useState, type ReactNode } from "react";
 
type YourTrackersContextValue = {
  yourtrackers: string[]; // ids
  isYourTrackers: (id: string) => boolean;
  toggleYourTrackers: (id: string) => void;
};
 
const YourTrackersContext = createContext<YourTrackersContextValue | null>(null);

export function YourTrackersProvider({ children }: { children: ReactNode }) {
  const [yourtrackers, setYourTrackers] = useState<string[]>([]);

  const isYourTrackers = (id: string) => yourtrackers.includes(id);
  const toggleYourTrackers = (id: string) =>
    setYourTrackers((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id],
    );
 
  return (
    <YourTrackersContext.Provider value={{ yourtrackers, isYourTrackers, toggleYourTrackers }}>
      {children}
    </YourTrackersContext.Provider>
  );
}
 
export function useYourTrackers() {
  const ctx = useContext(YourTrackersContext);
  if (!ctx) throw new Error("useYourTrackers must be used inside YourTrackersProvider");
  return ctx;
}
 