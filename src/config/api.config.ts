// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    CHECK_EMAIL: `${API_BASE_URL}/auth/check-email`,
    VERIFY_EMAIL: (userId: string) => `${API_BASE_URL}/auth/verify-email/${userId}`,
    RESEND_EMAIL_OTP: (userId: string) => `${API_BASE_URL}/auth/resend-email-otp/${userId}`,
    VERIFY_DEVICE: (userId: string) => `${API_BASE_URL}/auth/verify-device/${userId}`,
    CHECK_DEVICE: (userId: string) => `${API_BASE_URL}/auth/check-device/${userId}`,
    ACTIVATE_ACCOUNT: (userId: string) => `${API_BASE_URL}/auth/activate-account/${userId}`,
    GET_CURRENT_USER: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    GOOGLE: `${API_BASE_URL}/auth/google`,
    FACEBOOK: `${API_BASE_URL}/auth/facebook`,
    APPLE: `${API_BASE_URL}/auth/apple`,
  },
};

