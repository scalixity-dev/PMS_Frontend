import { API_ENDPOINTS } from '../config/api.config';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  pincode?: string;
  address?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      
      try {
        const errorData = await response.json();
        
        // Handle NestJS validation errors (array format)
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } 
        // Handle single error message
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Handle error field
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        // Log error for debugging
        console.error('Registration error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        // If JSON parsing fails, use status text
        errorMessage = `Registration failed: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Verify email OTP
   */
  async verifyEmail(userId: string, code: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Email verification failed',
        statusCode: response.status,
      }));
      throw new Error(errorData.message || `Email verification failed: ${response.statusText}`);
    }
  }

  /**
   * Verify device OTP
   */
  async verifyDevice(userId: string, code: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_DEVICE(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Device verification failed',
        statusCode: response.status,
      }));
      throw new Error(errorData.message || `Device verification failed: ${response.statusText}`);
    }
  }

  /**
   * Check device and send OTP if needed
   */
  async checkDevice(userId: string): Promise<{ requiresVerification: boolean; message: string }> {
    const response = await fetch(API_ENDPOINTS.AUTH.CHECK_DEVICE(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Device check failed',
        statusCode: response.status,
      }));
      throw new Error(errorData.message || `Device check failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Initiate OAuth flow
   */
  initiateOAuth(provider: 'google' | 'facebook' | 'apple'): void {
    const providerMap: Record<'google' | 'facebook' | 'apple', 'GOOGLE' | 'FACEBOOK' | 'APPLE'> = {
      google: 'GOOGLE',
      facebook: 'FACEBOOK',
      apple: 'APPLE',
    };
    const endpoint = API_ENDPOINTS.AUTH[providerMap[provider]];
    window.location.href = endpoint;
  }
}

export const authService = new AuthService();

