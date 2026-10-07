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
        name: "Health",
        type: "Health Category",
        frequency: "Yearly",
    },
    {
        id: "3",
        name: "Sleep",
        type: "Health Category",
        frequency: "Yearly",
    },
    {
        id: "4",
        name: "Habits",
        type: "Main Category",
        frequency: "Monthly",
    }
]