import { create } from 'zustand';
import type { UserInfo } from '../../../utils/types';

interface AuthState {
    userInfo: UserInfo | null;
    setUserInfo: (info: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userInfo: null,
    setUserInfo: (info) =>
        set((state) => ({
            userInfo: state.userInfo ? { ...state.userInfo, ...info } : info as UserInfo
        })),
}));
