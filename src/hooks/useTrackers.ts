// Custom hook wrapping YourTrackersContext for convenient import
import { fetchTracker, fetchTrackers } from "@/api/trackers";
import { useQuery } from "@tanstack/react-query";

export function useTrackers() {
  return useQuery({ queryKey: ["trackers"], queryFn: fetchTrackers });
}

export function useTracker(id: string) {
  return useQuery({
    queryKey: ["trackers", id],
    queryFn: () => fetchTracker(id),
    enabled: !!id,
  });
}
