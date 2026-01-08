import { create } from 'zustand';
import type { UserInfo } from '../../../utils/types';

interface AuthState {
    userInfo: UserInfo;
    setUserInfo: (info: Partial<UserInfo>) => void;
}

// Create empty default UserInfo to avoid exposing mock data in production
const createEmptyUserInfo = (): UserInfo => ({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    role: '',
    country: '',
    city: '',
    pincode: '',
    profileImage: undefined,
});

export const useAuthStore = create<AuthState>((set) => ({
    userInfo: createEmptyUserInfo(),
    setUserInfo: (info) =>
        set((state) => ({
            userInfo: { ...state.userInfo, ...info }
        })),
}));
