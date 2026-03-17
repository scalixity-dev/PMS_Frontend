import { create } from 'zustand';

interface OtpSessionState {
  userId: string | null;
  email: string | null;
  otpType: 'email' | 'device' | null;
  setOtpSession: (params: { userId: string; email: string; otpType: 'email' | 'device' }) => void;
  clearOtpSession: () => void;
}

export const useOtpSessionStore = create<OtpSessionState>((set) => ({
  userId: null,
  email: null,
  otpType: null,
  setOtpSession: (params) =>
    set({
      userId: params.userId,
      email: params.email,
      otpType: params.otpType,
    }),
  clearOtpSession: () =>
    set({
      userId: null,
      email: null,
      otpType: null,
    }),
}));
