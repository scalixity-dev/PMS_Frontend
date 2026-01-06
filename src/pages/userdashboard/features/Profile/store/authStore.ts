import { create } from 'zustand';
import type { UserInfo } from '../../../utils/types';

interface AuthState {
    userInfo: UserInfo;
    setUserInfo: (info: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userInfo: {
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        phone: "",
        role: "",
        country: "",
        city: "",
        pincode: "",
    },
    setUserInfo: (info) =>
        set((state) => ({
            userInfo: { ...state.userInfo, ...info }
        })),
}));
