// Purpose: Data list by tracker that feeds to each page with tracker information.

export type Tracker = {
    id: string;
    name: string;
    category: string;
    type: string;
    frequency: string;
    by: string;
    date: string;
    icon: string;
    active: boolean;
    notes: string;
};


export const trackers: Tracker[] = [
    {
        id: "1",
        name: "Mood",
        category: "Mental Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "By color",
        date: "",
        icon: "happy-outline",
        active: true,
        notes: "Mood Note",
    },
    {
        id: "2",
        name: "Energy",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "By color",
        date: "",
        icon: "flash-outline",
        active: true,
        notes: "Energy Note",
    },
    {
        id: "3",
        name: "Sleep",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        date: "",
        by: "By color",
        icon: "moon-outline",
        active: true,
        notes: "Sleep Note",
    },
    {
        id: "4",
        name: "Habits",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Monthly",
        by: "By color",
        date: "",
        icon: "checkmark-circle-outline",
        active: true,
        notes: "Habits Note",
    },
    {
        id: "5",
        name: "Highlight of the day",
        category: "Mental Health",
        type: "Journal",
        frequency: "Monthly",
        by: "With text",
        date: "",
        icon: "star-outline",
        active: true,
        notes: "Highlight Note",
    },
    {
        id: "6",
        name: "Gratitude Journal",
        category: "Mental Health",
        type: "Journal",
        frequency: "Monthly",
        by: "With text",
        date: "",
        icon: "heart-outline",
        active: true,
        notes: "Gratitude Note",
    },
    {
        id: "7",
        name: "Water",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "By color",
        date: "",
        icon: "water-outline",
        active: true,
        notes: "Water Note",
    },
    {
        id: "8",
        name: "Exercise",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "By color",
        date: "",
        icon: "barbell-outline",
        active: true,
        notes: "Exercise Note",
    },
]