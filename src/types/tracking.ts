// Purpose: Default items for daily tracking, calendar entries, and custom legend.

export type TrackerLegendItem = {
  id: string;
  label: string;
  color: string;
};

export type TrackerDayEntry = {
  date: string; // 'YYYY-MM-DD'
  optionId?: string;
  color?: string;
  label?: string;
  notes?: string;
};

// Default Legend for Mood only - will need to add more or move to database
export const DEFAULT_LEGEND_ITEMS: TrackerLegendItem[] = [
  { id: "sad", label: "Sad", color: "#8064A2" },
  { id: "anxious", label: "Anxious", color: "#4BACC6" },
  { id: "happy", label: "Happy", color: "#FFFF66" },
  { id: "stressed", label: "Stressed", color: "#F79646" },
  { id: "tired", label: "Tired", color: "#4F81BD" },
  { id: "energetic", label: "Energetic", color: "#59BA60" },
  { id: "ok", label: "Ok", color: "#9BBB59" },
  { id: "angry", label: "Angry", color: "#C0504D" },
];

// 54-color bullet journal palette table matching the reference chart
export const PALETTE_COLORS = [
  // Row 1
  "#F2DCDB",
  "#FDE9D9",
  "#FFFFDF",
  "#EBF1DE",
  "#DDF0E6",
  "#DAEEF3",
  "#DCE6F1",
  "#E4DFEC",
  // Row 2
  "#E6B8B7",
  "#FCD5B4",
  "#FFFFC1",
  "#D8E4BC",
  "#BBE3CC",
  "#B7DEE8",
  "#B8CCE4",
  "#CCC0DA",
  // Row 3
  "#DA9694",
  "#FABF8F",
  "#FFFFA2",
  "#C4D79B",
  "#9AD6B4",
  "#92CDDC",
  "#95B3D7",
  "#B1A0C7",
  // Row 4
  "#C0504D",
  "#F79646",
  "#FFFF66",
  "#9BBB59",
  "#59BA60",
  "#4BACC6",
  "#4F81BD",
  "#8064A2",
  // Row 5
  "#963634",
  "#E26B0A",
  "#FFFF0D",
  "#76933C",
  "#3C9160",
  "#31869B",
  "#366092",
  "#60497A",
  // Row 6
  "#632523",
  "#974706",
  "#B3B300",
  "#4F6228",
  "#286040",
  "#215967",
  "#244062",
  "#403151",
];
