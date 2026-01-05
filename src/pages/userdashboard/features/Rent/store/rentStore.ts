import { create } from 'zustand';
import type { RentFilters } from '../../../utils/types';

interface RentState {
    rentFilters: RentFilters;
    setRentFilters: (filters: Partial<RentFilters>) => void;
    resetRentFilters: () => void;
}

const initialFilters: RentFilters = {
    search: "",
    status: null,
    date: null,
    schedule: null,
};

export const useRentStore = create<RentState>((set) => ({
    rentFilters: initialFilters,
    setRentFilters: (filters) =>
        set((state) => ({
            rentFilters: { ...state.rentFilters, ...filters }
        })),
    resetRentFilters: () =>
        set({
            rentFilters: initialFilters
        }),
}));
