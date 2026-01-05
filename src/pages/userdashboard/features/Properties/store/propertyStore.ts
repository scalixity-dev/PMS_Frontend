import { create } from 'zustand';
import type { FilterState } from '../../../utils/types';

interface PropertyState {
    propertyFilters: FilterState | null;
    isPropertyFiltersOpen: boolean;
    setPropertyFilters: (filters: FilterState | null) => void;
    setIsPropertyFiltersOpen: (isOpen: boolean) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
    propertyFilters: null,
    isPropertyFiltersOpen: false,
    setPropertyFilters: (filters) => set({ propertyFilters: filters }),
    setIsPropertyFiltersOpen: (isOpen) => set({ isPropertyFiltersOpen: isOpen }),
}));
