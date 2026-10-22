// Custom hook wrapping YourTrackersContext for convenient import
import { useYourTrackers } from "@/context/YourTrackersContext";

export function useTrackers() {
  return useYourTrackers();
}
