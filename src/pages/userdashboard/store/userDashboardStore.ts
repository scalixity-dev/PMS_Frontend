import { create } from 'zustand';
import type { TabType, FilterState } from '../utils/types';

interface UserInfo {
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    phone: string;
    role: string;
    country: string;
    city: string;
    pincode: string;
}

interface UserFinances {
    outstanding: string;
    deposits: string;
    credits: string;
}

interface RentFilters {
    search: string;
    status: string | null;
    date: string | null;
    schedule: string | null;
}

interface RequestFilters {
    search: string;
    status: string | null;
    priority: string | null;
    category: string | null;
}

interface UserDashboardState {
    // Dashbord UI State
    activeTab: TabType;

    // User Data
    userInfo: UserInfo;
    finances: UserFinances;

    // Page specific states
    rentFilters: RentFilters;
    requestFilters: RequestFilters;
    propertyFilters: FilterState | null;
    isPropertyFiltersOpen: boolean;

    // Actions
    setActiveTab: (tab: TabType) => void;
    setUserInfo: (info: Partial<UserInfo>) => void;
    setFinances: (finances: Partial<UserFinances>) => void;

    setRentFilters: (filters: Partial<RentFilters>) => void;
    resetRentFilters: () => void;

    setRequestFilters: (filters: Partial<RequestFilters>) => void;
    resetRequestFilters: () => void;

    setPropertyFilters: (filters: FilterState | null) => void;
    setIsPropertyFiltersOpen: (isOpen: boolean) => void;
}

export const useUserDashboardStore = create<UserDashboardState>((set) => ({
    // Initial State
    activeTab: "Outstanding",

    userInfo: {
        firstName: "Rishabh",
        lastName: "Awasthi",
        dob: "13-11-2002",
        email: "rishabhawasthi@gmail.com",
        phone: "+91 7400908219",
        role: "Tenant",
        country: "India",
        city: "Indore, Madhya Pradesh",
        pincode: "452001",
    },

    finances: {
        outstanding: "0.00",
        deposits: "0.00",
        credits: "0.00",
    },

    rentFilters: {
        search: "",
        status: null,
        date: null,
        schedule: null,
    },

    requestFilters: {
        search: "",
        status: null,
        priority: null,
        category: null,
    },

    propertyFilters: null,
    isPropertyFiltersOpen: false,

    // Actions
    setActiveTab: (tab) => set({ activeTab: tab }),

    setUserInfo: (info) =>
        set((state) => ({
            userInfo: { ...state.userInfo, ...info }
        })),

    setFinances: (finances) =>
        set((state) => ({
            finances: { ...state.finances, ...finances }
        })),

    setRentFilters: (filters) =>
        set((state) => ({
            rentFilters: { ...state.rentFilters, ...filters }
        })),

    resetRentFilters: () =>
        set({
            rentFilters: {
                search: "",
                status: null,
                date: null,
                schedule: null,
            }
        }),

    setRequestFilters: (filters) =>
        set((state) => ({
            requestFilters: { ...state.requestFilters, ...filters }
        })),

    resetRequestFilters: () =>
        set({
            requestFilters: {
                search: "",
                status: null,
                priority: null,
                category: null,
            }
        }),

    setPropertyFilters: (filters) => set({ propertyFilters: filters }),
    setIsPropertyFiltersOpen: (isOpen) => set({ isPropertyFiltersOpen: isOpen }),
}));
