import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface PropertyFilters {
  status: string[];
  occupancy: string[];
  propertyType: string[];
  marketingStatus: string[];
  balance: string[];
}

interface PropertyPaginationState {
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  filters: PropertyFilters;

  // Actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: PropertyFilters) => void;
  resetFilters: () => void;
  resetPagination: () => void;
}

const defaultFilters: PropertyFilters = {
  status: [],
  occupancy: [],
  propertyType: [],
  marketingStatus: [],
  balance: []
};

export const usePropertyStore = create<PropertyPaginationState>()(
  devtools(
    persist(
      (set) => ({
        currentPage: 1,
        itemsPerPage: 9,
        searchQuery: '',
        filters: defaultFilters,

        setCurrentPage: (page) => set({ currentPage: Math.max(1, page) }),
        setItemsPerPage: (items) => set({ itemsPerPage: Math.min(100, Math.max(1, items)) }),
        setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
        setFilters: (filters) => set({ filters, currentPage: 1 }),
        resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),
        resetPagination: () => set({ currentPage: 1 }),
      }),
      {
        name: 'property-store', // localStorage key
        partialize: (state) => ({
          currentPage: state.currentPage,
          itemsPerPage: state.itemsPerPage,
          searchQuery: state.searchQuery,
          filters: state.filters,
        }),
      }
    ),
    { name: 'PropertyStore' }
  )
);
