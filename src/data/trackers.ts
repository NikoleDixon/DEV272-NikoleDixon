export type Tracker = {
    id: string;
    name: string;
    type: string;
    frequency: string;
};


export const trackers: Tracker [] = [
    {
        id: "1",
        name: "Mood",
        type: "Main Category",
        frequency: "Yearly",
    },
    {
        id: "2",
        name: "Energy",
        type: "Physical Health Category",
        frequency: "Yearly",
    },
    {
        id: "3",
        name: "Sleep",
        type: "Physical Health Category",
        frequency: "Yearly",
    },
    {
        id: "4",
        name: "Habits",
        type: "Main Category",
        frequency: "Monthly",
    },
    {
        id: "5",
        name: "Highlight of the day",
        type: "Mental Health Category",
        frequency: "Monthly",
    },
    {
        id: "6",
        name: "Gratitude Journal",
        type: "Mental Health Category",
        frequency: "Monthly",
    },
    {
        id: "7",
        name: "Water",
        type: "Physical Health Category",
        frequency: "Yearly",
    },
    {
        id: "8",
        name: "Exercise",
        type: "Physical Health Category",
        frequency: "Monthly",
    }
]