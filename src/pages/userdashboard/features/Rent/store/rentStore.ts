import { create } from 'zustand';
import type { RentFilters } from '../../../utils/types';

interface RentState {
    rentFilters: RentFilters;
    setRentFilters: (filters: Partial<RentFilters>) => void;
    resetRentFilters: () => void;
}

export const useRentStore = create<RentState>((set) => ({
    rentFilters: {
        search: "",
        status: null,
        date: null,
        schedule: null,
    },
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
}));
