import type { ReactNode } from 'react';

export interface Transaction {
    id: string;
    status: 'Open' | 'Overdue' | 'Paid' | 'Partial';
    dueDate: string;
    category: string;
    contact: {
        name: string;
        initials: string;
        avatarColor: string;
    };
    amount: number;
    paidAmount?: number;
    currency: string;
    schedule: 'Monthly' | 'One-time';
}

export interface TenantSummary {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatarSeed: string;
}

export interface LandlordSummary {
    name: string;
    avatarSeed?: string;
}

export interface PropertySummary {
    name: string;
    address: string;
}

export interface Lease {
    id: string;
    number: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired' | 'Pending';
    property: PropertySummary;
    landlord: LandlordSummary;
    tenants: TenantSummary[];
    attachments?: {
        id: string;
        name: string;
        size: string;
        type: 'PDF' | 'Image' | 'Document' | 'Video';
        url?: string;
    }[];
}

export type TabType = "Outstanding" | "Leases" | "Service providers" | "Applications";

export type DashboardStage = 'loading' | 'error' | 'no_lease' | 'application_submitted' | 'move_in';


export interface PropertyFeature {
    icon: ReactNode; // React component from lucide-react
    label: string;
    value: string;
}

export interface Property {
    id: string | number; // Support both for now to avoid breaking existing code
    uniqueId?: string; // Composite ID for React keys
    title: string;
    address: string;
    availabilityDate?: string;
    rent?: number;
    price?: string; // Formatted price with currency (e.g., "₹50,000" or "$1,500")
    type: string;
    currency?: string; // Currency symbol (e.g., "$", "₹", "€")
    currencyCode?: string; // ISO currency code (e.g., "USD", "INR", "EUR")
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
    amenities?: string[]; // Added for client-side filtering
}


export interface LocationFilter {
    displayText: string; // For display purposes
    type: 'city' | 'nearby' | 'radius' | 'state' | 'all';
    country?: string;
    city?: string;
    state?: string;
    radius?: number; // in km
}

export interface FilterState {
    search: string;
    propertyType: string;
    region: string; // Kept for backward compatibility - display text
    locationFilter?: LocationFilter; // New structured location data
    minPrice: number;
    maxPrice: number;
    priceModified?: boolean; // Track if user has interacted with price controls
    locationModified?: boolean; // Track if user has interacted with location controls
    bedrooms: string;
    availability: string;
    selectedAmenities: string[];
    petsAllowed: string;
}
export interface UserInfo {
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    phone: string;
    role: string;
    country: string;
    city: string;
    pincode: string;
    profileImage?: string;
}

export interface UserFinances {
    outstanding: string;
    deposits: string;
    credits: string;
}

export interface RentFilters {
    search: string;
    status: string | null;
    date: string | null;
    schedule: string | null;
}

export interface RequestFilters {
    search: string;
    status: string | null;
    priority: string | null;
    category: string | null;
}

export interface AvailabilityOption {
    id: number;
    date: string;
    timeSlots: string[];
}

export interface ServiceRequest {
    id: string | number;
    status: "New" | "In Progress" | "Completed" | "Cancelled";
    requestId: string;
    title?: string;
    category: string;
    property: string;
    equipment?: string | null;
    equipmentSerial?: string | null;
    equipmentCondition?: string | null;
    priority: "Critical" | "Normal" | "Low";
    assignee: string;
    subCategory?: string;
    problem?: string;
    subIssue?: string;
    description?: string;
    authorizationToEnter?: string;
    authorizationCode?: string;
    setUpDateTime?: string;
    dateDue?: string | null;
    materials?: any[];
    availability?: AvailabilityOption[];
    createdAt: string;
    attachments?: (File | string)[]; // Can be File objects or data URL strings
    video?: File | string | null; // Can be File object or data URL string
    pets?: string[];
    amount?: number;
    chargeTo?: string;
    tenantChargeApprovedAt?: string | null;
}

export interface Publication {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
}
