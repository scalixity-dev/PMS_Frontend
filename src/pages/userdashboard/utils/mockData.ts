import type { Transaction, Lease, ServiceRequest } from "./types";

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
        currency: "INR",
        schedule: "Monthly"
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
        currency: "INR",
        schedule: "Monthly"
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
        currency: "INR",
        schedule: "One-time"
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
        currency: "INR",
        schedule: "One-time"
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
        currency: "INR",
        schedule: "Monthly"
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
                id: "1",
                name: "Lease Agreement.pdf",
                size: "2.4 MB",
                type: "PDF",
                url: "https://pdfobject.com/pdf/sample.pdf"
            },
            {
                id: "2",
                name: "Move-in Notice.pdf",
                size: "0.5 MB",
                type: "PDF",
                url: "https://pdfobject.com/pdf/sample.pdf"
            },
            {
                id: "3",
                name: "Property Rules.pdf",
                size: "1.2 MB",
                type: "PDF",
                url: "https://pdfobject.com/pdf/sample.pdf"
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

export const mockRequests: ServiceRequest[] = [
    {
        id: 1,
        status: "New",
        requestId: "1359452",
        category: "Electrical",
        subCategory: "Lights",
        property: "bhbh",
        problem: "Interior / Light switch problems",
        priority: "Critical",
        assignee: "Ashendra Sharma",
        description: "testinggg",
        createdAt: "2026-01-06T03:59:00Z",
    },
    {
        id: 2,
        status: "In Progress",
        requestId: "1359453",
        category: "Electrical",
        subCategory: "Outlets",
        property: "Grand Villa",
        problem: "Interior / Sparkling",
        priority: "Normal",
        assignee: "Siddak Bagga",
        createdAt: "2026-01-05T23:17:00Z",
    },
    {
        id: 3,
        status: "New",
        requestId: "1359454",
        category: "Electrical",
        subCategory: "Ceiling Fan",
        property: "Grand Villa",
        problem: "Smoke Detectors / Beeping",
        priority: "Low",
        assignee: "",
        createdAt: "2026-01-03T07:02:00Z",
    },
    {
        id: 4,
        status: "Completed",
        requestId: "1359455",
        category: "Electrical",
        subCategory: "Outlets",
        property: "bhbh",
        problem: "Interior / Sparkling",
        priority: "Normal",
        assignee: "",
        createdAt: "2026-01-03T04:45:00Z",
    },
    {
        id: 5,
        status: "New",
        requestId: "1359456",
        category: "Appliances",
        subCategory: "Refrigerator",
        property: "bhbh",
        problem: "Temperature / Too cold",
        priority: "Critical",
        assignee: "",
        createdAt: "2025-12-22T05:04:00Z",
    },
    {
        id: 6,
        status: "New",
        requestId: "1359457",
        category: "Outdoors",
        subCategory: "Fencing & Roof",
        property: "Grand Villa",
        problem: "Installation / Wood fence",
        priority: "Normal",
        assignee: "",
        createdAt: "2025-12-22T05:03:00Z",
    }
];

