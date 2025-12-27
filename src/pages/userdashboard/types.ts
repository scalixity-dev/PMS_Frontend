export interface Transaction {
    id: string;
    status: 'Open' | 'Overdue' | 'Active' | 'New' | 'Critical' | 'Normal';
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

export interface PropertyFeature {
    icon: string; // Icon name from lucide-react
    label: string;
    value: string;
}

export interface Property {
    id: string | number; // Support both for now to avoid breaking existing code
    title: string;
    address: string;
    availabilityDate?: string;
    rent?: number;
    price?: string; // Support both for now
    type: string;
    currency?: string;
    images?: string[];
    image?: string; // Support both for now
    description?: string;
    features?: PropertyFeature[];
    agent?: {
        name: string;
        phone: string;
        email: string;
    };
    discount?: string;
    tag?: string; // Support both for now
}

export interface FilterState {
    search: string;
    propertyType: string;
    region: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: string;
    availability: string;
    selectedAmenities: string[];
}


