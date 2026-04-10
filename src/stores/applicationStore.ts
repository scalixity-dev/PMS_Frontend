import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface ApplicationPaginationState {
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  status: string;

  // Actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSearchQuery: (query: string) => void;
  setStatus: (status: string) => void;
  resetPagination: () => void;
}

export const useApplicationStore = create<ApplicationPaginationState>()(
  devtools(
    persist(
      (set) => ({
        currentPage: 1,
        itemsPerPage: 10,
        searchQuery: '',
        status: '',

        setCurrentPage: (page) => set({ currentPage: Math.max(1, page) }),
        setItemsPerPage: (items) => set({ itemsPerPage: Math.min(100, Math.max(1, items)) }),
        setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
        setStatus: (status) => set({ status, currentPage: 1 }),
        resetPagination: () => set({ currentPage: 1, searchQuery: '', status: '' }),
      }),
      {
        name: 'application-store',
        partialize: (state) => ({
          currentPage: state.currentPage,
          itemsPerPage: state.itemsPerPage,
          searchQuery: state.searchQuery,
          status: state.status,
        }),
      }
    ),
    { name: 'ApplicationStore' }
  )
);
