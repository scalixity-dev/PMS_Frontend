import { create } from 'zustand';
import type { TabType, UserFinances } from '../utils/types';

interface DashboardState {
    activeTab: TabType;
    finances: UserFinances;
    setActiveTab: (tab: TabType) => void;
    setFinances: (finances: Partial<UserFinances>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    activeTab: "Outstanding",
    finances: {
        outstanding: "0.00",
        deposits: "0.00",
        credits: "0.00",
    },
    setActiveTab: (tab) => set({ activeTab: tab }),
    setFinances: (finances) =>
        set((state) => ({
            finances: { ...state.finances, ...finances }
        })),
}));
