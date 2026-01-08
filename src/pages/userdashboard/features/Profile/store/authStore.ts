import { create } from 'zustand';
import type { UserInfo } from '../../../utils/types';
import { mockUserInfo } from '../../../utils/mockData';

interface AuthState {
    userInfo: UserInfo;
    setUserInfo: (info: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userInfo: mockUserInfo,
    setUserInfo: (info) =>
        set((state) => ({
            userInfo: { ...state.userInfo, ...info }
        })),
}));
