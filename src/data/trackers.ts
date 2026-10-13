export type Tracker = {
    id: string;
    name: string;
    type: string;
    frequency: string;
    icon: string;
};


export const trackers: Tracker[] = [
    {
        id: "1",
        name: "Mood",
        type: "Main Category",
        frequency: "Yearly",
        icon: "happy-outline",
    },
    {
        id: "2",
        name: "Energy",
        type: "Physical Health Category",
        frequency: "Yearly",
        icon: "flash-outline",
    },
    {
        id: "3",
        name: "Sleep",
        type: "Physical Health Category",
        frequency: "Yearly",
        icon: "moon-outline",
    },
    {
        id: "4",
        name: "Habits",
        type: "Main Category",
        frequency: "Monthly",
        icon: "checkmark-circle-outline",
    },
    {
        id: "5",
        name: "Highlight of the day",
        type: "Mental Health Category",
        frequency: "Monthly",
        icon: "star-outline",
    },
    {
        id: "6",
        name: "Gratitude Journal",
        type: "Mental Health Category",
        frequency: "Monthly",
        icon: "heart-outline",
    },
    {
        id: "7",
        name: "Water",
        type: "Physical Health Category",
        frequency: "Yearly",
        icon: "water-outline",
    },
    {
        id: "8",
        name: "Exercise",
        type: "Physical Health Category",
        frequency: "Monthly",
        icon: "barbell-outline",
    },
]