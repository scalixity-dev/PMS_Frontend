import { create } from 'zustand';
import type { TabType, UserFinances, DashboardStage, TenantSummary } from '../utils/types';

interface DashboardState {
    activeTab: TabType;
    finances: UserFinances;
    dashboardStage: DashboardStage;
    roommates: TenantSummary[];
    setActiveTab: (tab: TabType) => void;
    setFinances: (finances: Partial<UserFinances>) => void;
    setDashboardStage: (stage: DashboardStage) => void;
    setRoommates: (roommates: TenantSummary[]) => void;

}

export const useDashboardStore = create<DashboardState>((set) => ({
    activeTab: "Outstanding",
    finances: {
        outstanding: "0.00",
        deposits: "0.00",
        credits: "0.00",
    },
    dashboardStage: "loading",
    roommates: [],
    setActiveTab: (tab) => set({ activeTab: tab }),
    setFinances: (finances) =>
        set((state) => ({
            finances: { ...state.finances, ...finances }
        })),
    setDashboardStage: (stage) => set({ dashboardStage: stage }),
    setRoommates: (roommates) => set({ roommates }),
}));

