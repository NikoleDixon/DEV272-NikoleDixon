// Purpose: Data list by tracker that feeds to each page with tracker basic information listed.

export type Tracker = {
    id: string;
    name: string;
    category: string;
    type: string;
    frequency: string;
    by: string;
    date: string; // made this a string until we start using Supabase
    icon: string;
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
        notes: "",
    },
    {
        id: "2",
        name: "Energy",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "by color",
        date: "",
        icon: "flash-outline",
        notes: "",
    },
    {
        id: "3",
        name: "Sleep",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        date: "",
        by: "by color",
        icon: "moon-outline",
        notes: "",
    },
    {
        id: "4",
        name: "Habits",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Monthly",
        by: "by color",
        date: "",
        icon: "checkmark-circle-outline",
        notes: "",
    },
    {
        id: "5",
        name: "Highlight of the day",
        category: "Mental Health",
        type: "Journal",
        frequency: "Monthly",
        by: "with text",
        date: "",
        icon: "star-outline",
        notes: "",
    },
    {
        id: "6",
        name: "Gratitude Journal",
        category: "Mental Health",
        type: "Journal",
        frequency: "Monthly",
        by: "with text",
        date: "",
        icon: "heart-outline",
        notes: "",
    },
    {
        id: "7",
        name: "Water",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "by color",
        date: "",
        icon: "water-outline",
        notes: "",
    },
    {
        id: "8",
        name: "Exercise",
        category: "Physical Health",
        type: "Tracker",
        frequency: "Yearly",
        by: "by color",
        date: "",
        icon: "barbell-outline",
        notes: "",
    },
]