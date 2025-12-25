export interface Transaction {
    id: string;
    status: 'Open' | 'Overdue' | 'Paid';
    dueDate: string;
    category: string;
    contact: {
        name: string;
        initials: string;
        avatarColor: string;
    };
    amount: number;
    currency: string;
}

export interface Lease {
    id: string;
    number: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired' | 'Pending';
    landlordAvatar?: string;
}

export type TabType = "Outstanding" | "Leases" | "Service providers" | "Inspections";
