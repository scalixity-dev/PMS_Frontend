import { create } from 'zustand';
import type { TabType, FilterState, UserInfo, UserFinances, RentFilters, RequestFilters, ServiceRequest } from '../utils/types';

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
    requests: ServiceRequest[];

    // Actions
    setActiveTab: (tab: TabType) => void;
    setUserInfo: (info: Partial<UserInfo>) => void;
    setFinances: (finances: Partial<UserFinances>) => void;

    setRentFilters: (filters: Partial<RentFilters>) => void;
    resetRentFilters: () => void;

    setRequestFilters: (filters: Partial<RequestFilters>) => void;
    resetRequestFilters: () => void;

    addRequest: (request: ServiceRequest) => void;

    setPropertyFilters: (filters: FilterState | null) => void;
    setIsPropertyFiltersOpen: (isOpen: boolean) => void;
}

export const useUserDashboardStore = create<UserDashboardState>((set) => ({
    // Initial State
    activeTab: "Outstanding",

    userInfo: {
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        phone: "",
        role: "",
        country: "",
        city: "",
        pincode: "",
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
    requests: [
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
    ],

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

    addRequest: (request) =>
        set((state) => ({
            requests: [request, ...state.requests]
        })),

    setPropertyFilters: (filters) => set({ propertyFilters: filters }),
    setIsPropertyFiltersOpen: (isOpen) => set({ isPropertyFiltersOpen: isOpen }),
}));
