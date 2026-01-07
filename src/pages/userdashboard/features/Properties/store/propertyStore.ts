import { create } from 'zustand';
import type { FilterState } from '../../../utils/types';

const defaultFilters: FilterState = {
    search: "",
    propertyType: "All",
    region: "All Locations",
    minPrice: 0,
    maxPrice: 50000,
    bedrooms: "All",
    availability: "All",
    selectedAmenities: [],
    petsAllowed: "All"
};

interface PropertyState {
    propertyFilters: FilterState;
    isPropertyFiltersOpen: boolean;
    setPropertyFilters: (filters: FilterState) => void;
    resetPropertyFilters: () => void;
    setIsPropertyFiltersOpen: (isOpen: boolean) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
    propertyFilters: defaultFilters,
    isPropertyFiltersOpen: false,
    setPropertyFilters: (filters) => set({ propertyFilters: filters }),
    resetPropertyFilters: () => set({ propertyFilters: defaultFilters }),
    setIsPropertyFiltersOpen: (isOpen) => set({ isPropertyFiltersOpen: isOpen }),
}));
