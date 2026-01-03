import type { Transaction, Lease } from "./types";

export const mockTransactions: Transaction[] = [
    {
        id: "1",
        status: "Open",
        dueDate: "02 Jan, 2026", // Today
        category: "Rent",
        contact: {
            name: "Ashendra Sharma",
            initials: "AS",
            avatarColor: "#52D3A2"
        },
        amount: -2611.00,
        currency: "INR"
    },
    {
        id: "2",
        status: "Open",
        dueDate: "05 Jan, 2026", // This week
        category: "Rent",
        contact: {
            name: "Ashendra Sharma",
            initials: "AS",
            avatarColor: "#52D3A2"
        },
        amount: -45000.00,
        currency: "INR"
    },
    {
        id: "3",
        status: "Overdue",
        dueDate: "15 Jan, 2026", // This month
        category: "Deposit",
        contact: {
            name: "Ashendra Sharma",
            initials: "AS",
            avatarColor: "#52D3A2"
        },
        amount: -26111.00,
        currency: "INR"
    },
    {
        id: "4",
        status: "Open",
        dueDate: "20 Dec, 2025", // Last month
        category: "Maintenance Fee",
        contact: {
            name: "John Doe",
            initials: "JD",
            avatarColor: "#FF6B6B"
        },
        amount: -5000.00,
        currency: "INR"
    },
    {
        id: "5",
        status: "Active",
        dueDate: "01 Jan, 2026", // This week
        category: "Utility Bill",
        contact: {
            name: "Sarah Wilson",
            initials: "SW",
            avatarColor: "#4ECDC4"
        },
        amount: -1500.00,
        currency: "INR"
    }
];

export const mockLeases: Lease[] = [
    {
        id: "1",
        number: "20",
        startDate: "17 Dec, 2025",
        endDate: "17 Dec, 2026",
        status: "Active",
        landlordAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    {
        id: "2",
        number: "21",
        startDate: "17 Dec, 2025",
        endDate: "17 Dec, 2026",
        status: "Active",
        landlordAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    }
];

export const tabs = ["Outstanding", "Leases", "Service providers", "Inspections"];
