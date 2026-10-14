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
        type: "Mental Health",
        frequency: "Yearly",
        icon: "happy-outline",
    },
    {
        id: "2",
        name: "Energy",
        type: "Physical Health",
        frequency: "Yearly",
        icon: "flash-outline",
    },
    {
        id: "3",
        name: "Sleep",
        type: "Physical Health",
        frequency: "Yearly",
        icon: "moon-outline",
    },
    {
        id: "4",
        name: "Habits",
        type: "Physical Health",
        frequency: "Monthly",
        icon: "checkmark-circle-outline",
    },
    {
        id: "5",
        name: "Highlight of the day",
        type: "Mental Health",
        frequency: "Monthly",
        icon: "star-outline",
    },
    {
        id: "6",
        name: "Gratitude Journal",
        type: "Mental Health",
        frequency: "Monthly",
        icon: "heart-outline",
    },
    {
        id: "7",
        name: "Water",
        type: "Physical Health",
        frequency: "Yearly",
        icon: "water-outline",
    },
    {
        id: "8",
        name: "Exercise",
        type: "Physical Health",
        frequency: "Monthly",
        icon: "barbell-outline",
    },
]