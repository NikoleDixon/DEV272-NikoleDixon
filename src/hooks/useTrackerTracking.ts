// Purpose: Hook for managing and persisting tracker daily entries and custom legends in AsyncStorage.

import { loadJson, saveJson, STORAGE_KEYS } from "@/lib/storage";
import {
  DEFAULT_LEGEND_ITEMS,
  TrackerDayEntry,
  TrackerLegendItem,
} from "@/types/tracking";
import { useCallback, useEffect, useState } from "react";

export function useTrackerTracking(trackerId: string) {
  const [legend, setLegend] =
    useState<TrackerLegendItem[]>(DEFAULT_LEGEND_ITEMS);
  const [entries, setEntries] = useState<Record<string, TrackerDayEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Hydrate tracker legend & entries from AsyncStorage on mount / tracker change
  useEffect(() => {
    let isCurrent = true;
    Promise.all([
      loadJson<Record<string, TrackerLegendItem[]>>(
        STORAGE_KEYS.trackerLegends,
        {},
      ),
      loadJson<Record<string, Record<string, TrackerDayEntry>>>(
        STORAGE_KEYS.trackerEntries,
        {},
      ),
    ]).then(([storedLegends, storedEntries]) => {
      if (!isCurrent) return;
      const trackerLegend = storedLegends[trackerId] ?? DEFAULT_LEGEND_ITEMS;
      const trackerEntries = storedEntries[trackerId] ?? {};
      setLegend(trackerLegend);
      setEntries(trackerEntries);
      setIsLoaded(true);
    });

    return () => {
      isCurrent = false;
    };
  }, [trackerId]);

  // 2. Set or clear a day entry
  const setDayEntry = useCallback(
    async (date: string, item: TrackerLegendItem | null, notes?: string) => {
      const allEntries = await loadJson<
        Record<string, Record<string, TrackerDayEntry>>
      >(STORAGE_KEYS.trackerEntries, {});
      const currentTrackerEntries = { ...(allEntries[trackerId] ?? {}) };

      if (!item) {
        delete currentTrackerEntries[date];
      } else {
        currentTrackerEntries[date] = {
          date,
          optionId: item.id,
          color: item.color,
          label: item.label,
          notes,
        };
      }

      const updatedAll = {
        ...allEntries,
        [trackerId]: currentTrackerEntries,
      };

      setEntries(currentTrackerEntries);
      await saveJson(STORAGE_KEYS.trackerEntries, updatedAll);
    },
    [trackerId],
  );

  // 3. Save entire legend list (and synchronize colors on existing entries if matching)
  const saveLegend = useCallback(
    async (newLegend: TrackerLegendItem[]) => {
      const allLegends = await loadJson<Record<string, TrackerLegendItem[]>>(
        STORAGE_KEYS.trackerLegends,
        {},
      );
      const updatedLegends = {
        ...allLegends,
        [trackerId]: newLegend,
      };

      // Also update any entries whose option color/label changed
      const allEntries = await loadJson<
        Record<string, Record<string, TrackerDayEntry>>
      >(STORAGE_KEYS.trackerEntries, {});
      const currentTrackerEntries = { ...(allEntries[trackerId] ?? {}) };
      let entriesChanged = false;

      const legendMap = new Map(newLegend.map((i) => [i.id, i]));
      for (const [date, entry] of Object.entries(currentTrackerEntries)) {
        if (entry.optionId && legendMap.has(entry.optionId)) {
          const matching = legendMap.get(entry.optionId)!;
          if (
            entry.color !== matching.color ||
            entry.label !== matching.label
          ) {
            currentTrackerEntries[date] = {
              ...entry,
              color: matching.color,
              label: matching.label,
            };
            entriesChanged = true;
          }
        }
      }

      setLegend(newLegend);
      await saveJson(STORAGE_KEYS.trackerLegends, updatedLegends);

      if (entriesChanged) {
        setEntries(currentTrackerEntries);
        await saveJson(STORAGE_KEYS.trackerEntries, {
          ...allEntries,
          [trackerId]: currentTrackerEntries,
        });
      }
    },
    [trackerId],
  );

  // 4. Add a new legend item
  const addLegendItem = useCallback(
    async (label: string, color: string) => {
      const newItem: TrackerLegendItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        label: label.trim() || "New Mood",
        color: color.trim() || "#70c400",
      };
      await saveLegend([...legend, newItem]);
    },
    [legend, saveLegend],
  );

  // 5. Update an existing legend item
  const updateLegendItem = useCallback(
    async (id: string, label: string, color: string) => {
      const updated = legend.map((item) =>
        item.id === id
          ? {
              ...item,
              label: label.trim() || item.label,
              color: color.trim() || item.color,
            }
          : item,
      );
      await saveLegend(updated);
    },
    [legend, saveLegend],
  );

  // 6. Delete a legend item
  const deleteLegendItem = useCallback(
    async (id: string) => {
      const updated = legend.filter((item) => item.id !== id);
      await saveLegend(updated);
    },
    [legend, saveLegend],
  );

  return {
    legend,
    entries,
    isLoaded,
    setDayEntry,
    saveLegend,
    addLegendItem,
    updateLegendItem,
    deleteLegendItem,
  };
}
