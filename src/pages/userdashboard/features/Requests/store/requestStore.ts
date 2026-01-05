import { create } from 'zustand';
import type { RequestFilters, ServiceRequest } from '../../../utils/types';
import { mockRequests } from "../../../utils/mockData";

interface RequestState {
    requests: ServiceRequest[];
    requestFilters: RequestFilters;
    setRequestFilters: (filters: Partial<RequestFilters>) => void;
    resetRequestFilters: () => void;
    addRequest: (request: ServiceRequest) => void;
    updateRequestStatus: (id: number, status: ServiceRequest["status"]) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
    requestFilters: {
        search: "",
        status: null,
        priority: null,
        category: null,
    },
    requests: mockRequests as ServiceRequest[],
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
    updateRequestStatus: (id, status) =>
        set((state) => ({
            requests: state.requests.map((req) =>
                req.id === id ? { ...req, status } : req
            )
        })),
}));
