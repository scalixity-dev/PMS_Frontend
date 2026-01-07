import type { Transaction, Lease } from "./types";

export const mockTransactions: Transaction[] = [
    {
        id: "1",
        status: "Paid",
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
        status: "Partial",
        dueDate: "01 Jan, 2026", // This week
        category: "Utility Bill",
        contact: {
            name: "Sarah Wilson",
            initials: "SW",
            avatarColor: "#4ECDC4"
        },
        amount: -750.00,
        paidAmount: 250.00,
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
        property: {
            name: "Sunset Apartments",
            address: "123 Sunset Blvd, CA"
        },
        landlord: {
            name: "Ashendra Sharma",
            avatarSeed: "Felix"
        },
        tenants: [
            {
                id: "t1",
                firstName: "Siddak",
                lastName: "Bagga",
                email: "siddak@example.com",
                phone: "+1 (888) 888 8888",
                avatarSeed: "Siddak"
            },
            {
                id: "t2",
                firstName: "Atul",
                lastName: "Rawat",
                email: "atul@example.com",
                phone: "+1 (888) 888 8888",
                avatarSeed: "Atul"
            }
        ],
        attachments: [
            {
                id: 1,
                name: "Lease Agreement.pdf",
                size: "2.4 MB",
                type: "PDF",
                url: "/documents/lease-agreement.pdf"
            },
            {
                id: 2,
                name: "Move-in Notice.pdf",
                size: "0.5 MB",
                type: "PDF",
                url: "/documents/move-in-notice.pdf"
            },
            {
                id: 3,
                name: "Property Rules.pdf",
                size: "1.2 MB",
                type: "PDF",
                url: "/documents/property-rules.pdf"
            }
        ]
    },
    {
        id: "2",
        number: "21",
        startDate: "17 Dec, 2025",
        endDate: "17 Dec, 2026",
        status: "Active",
        property: {
            name: "Green Valley Homes",
            address: "456 Green Valley Dr, TX"
        },
        landlord: {
            name: "John Doesmith",
            avatarSeed: "Aneka"
        },
        tenants: [
            {
                id: "t3",
                firstName: "Rishabh",
                lastName: "Awasthi",
                email: "rishabh@example.com",
                phone: "+1 (555) 555 5555",
                avatarSeed: "Rishabh"
            }
        ]
    }
];

export const tabs = ["Outstanding", "Leases", "Service providers"];

export const mockUserInfo = {
    firstName: "Rishabh",
    lastName: "Awasthi",
    dob: "13-11-2002",
    email: "rishabhawasthi@gmail.com",
    phone: "+91 7400908219",
    role: "Tenant",
    country: "India",
    city: "Indore, Madhya Pradesh",
    pincode: "452001",
};

export const mockFinances = {
    outstanding: "0.00",
    deposits: "0.00",
    credits: "0.00",
};

export const mockRequests = [
    {
        id: 1,
        status: "New",
        requestId: "REQ-001",
        category: "Appliances",
        property: "Sunset Boulevard 123",
        priority: "Critical",
        assignee: "",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        status: "New",
        requestId: "REQ-002",
        category: "Electrical",
        property: "Harbor View Apt 4B",
        priority: "Normal",
        assignee: "",
        createdAt: new Date().toISOString(),
    },
];

