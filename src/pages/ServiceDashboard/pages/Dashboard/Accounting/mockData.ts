export interface Transaction {
    id: string;
    status: string;
    dueDate: string;
    category: string;
    contact: string;
    total: string;
    // Detailed fields
    description: string;
    amount: number;
    amountLeft: number;
    payer: {
        name: string;
        email: string;
        avatar: string;
    };
    property: string;
    unit: string;
    type: string;
    activity: {
        date: string;
        status: string;
        amount: number;
        user: {
            avatar: string;
        };
    }[];
}

export const mockTransactions: Transaction[] = [
    { 
        id: '1', 
        status: 'Paid', 
        dueDate: '2023-11-15', 
        category: 'One-time', 
        contact: 'Alice Supplier', 
        total: '1,200.00 INR',
        description: 'Plumbing / Repair',
        amount: 1200.00,
        amountLeft: 0,
        payer: { name: 'Alice Supplier', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=1' },
        property: 'Sunset Apartments',
        unit: '101',
        type: 'Expense / One Time',
        activity: [{ date: 'Nov 15, 2023', status: 'Success', amount: 1200.00, user: { avatar: 'https://i.pravatar.cc/150?u=1' } }]
    },
    { 
        id: '2', 
        status: 'Unpaid', 
        dueDate: '2023-11-20', 
        category: 'Recurring', 
        contact: 'Bob Contractor', 
        total: '3,500.00 INR',
        description: 'Monthly Maintenance',
        amount: 3500.00,
        amountLeft: 3500.00,
        payer: { name: 'Bob Contractor', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=2' },
        property: 'Downtown Lofts',
        unit: '-',
        type: 'Expense / Recurring',
        activity: []
    },
    { 
        id: '3', 
        status: 'Pending', 
        dueDate: '2023-11-25', 
        category: 'One-time', 
        contact: 'Charlie Fixes', 
        total: '850.00 INR',
        description: 'Electrical Repair',
        amount: 850.00,
        amountLeft: 850.00,
        payer: { name: 'Charlie Fixes', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=3' },
        property: 'Ocean View Villa',
        unit: 'Villa A',
        type: 'Expense / One Time',
        activity: []
    },
    { 
        id: '4', 
        status: 'Overdue', 
        dueDate: '2023-11-10', 
        category: 'Recurring', 
        contact: 'Delta Maint.', 
        total: '2,100.00 INR',
        description: 'Landscaping',
        amount: 2100.00,
        amountLeft: 2100.00,
        payer: { name: 'Delta Maint.', email: 'delta@example.com', avatar: 'https://i.pravatar.cc/150?u=4' },
        property: 'Mountain Retreat',
        unit: '-',
        type: 'Expense / Recurring',
        activity: []
    },
    { 
        id: '5', 
        status: 'Paid', 
        dueDate: '2023-11-18', 
        category: 'One-time', 
        contact: 'Echo Cleaners', 
        total: '500.00 INR',
        description: 'Cleaning / General',
        amount: 500.00,
        amountLeft: 0,
        payer: { name: 'Echo Cleaners', email: 'echo@example.com', avatar: 'https://i.pravatar.cc/150?u=5' },
        property: 'Luxury Apartment',
        unit: 'Penthouse',
        type: 'Expense / One Time',
        activity: [{ date: 'Nov 18, 2023', status: 'Success', amount: 500.00, user: { avatar: 'https://i.pravatar.cc/150?u=5' } }]
    }
];
