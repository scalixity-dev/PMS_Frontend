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

export interface ActivateAccountRequest {
  planId: string;
  isYearly?: boolean;
}

export interface ActivateAccountResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    isEmailVerified: boolean;
    isActive: boolean;
  };
  message?: string;
  requiresDeviceVerification?: boolean;
  requiresEmailVerification?: boolean;
  token?: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  isEmailVerified: boolean;
  isActive: boolean;
  country?: string;
  address?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  state?: string;
  pincode?: string;
}

export interface UpdateProfileRequest {
  phoneCountryCode?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  pincode?: string;
  address?: string;
}

class AuthService {
  /**
   * Register a new tenant user
   */
  async registerTenant(data: { email: string; password: string; fullName: string }): Promise<RegisterResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER_TENANT, {
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
        console.error('Tenant registration error:', {
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
   * Register a new service provider user
   */
  async registerServicePro(data: { email: string; password: string; fullName: string }): Promise<RegisterResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER_SERVICE_PRO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';

      try {
        const errorData = await response.json();

        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Registration failed: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

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
   * Resend email verification OTP
   */
  async resendEmailOtp(userId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.RESEND_EMAIL_OTP(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to resend OTP',
        statusCode: response.status,
      }));
      throw new Error(errorData.message || `Failed to resend OTP: ${response.statusText}`);
    }
  }

  /**
   * Resend device verification OTP
   */
  async resendDeviceOtp(userId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.RESEND_DEVICE_OTP(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Failed to resend device OTP',
        statusCode: response.status,
      }));
      throw new Error(errorData.message || `Failed to resend device OTP: ${response.statusText}`);
    }
  }

  /**
   * Request password reset (forgot password). Sends a reset link/OTP to the given email.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to send password reset email';

      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        errorMessage = `Failed to send password reset: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Reset password using OTP and new password (forgot password flow).
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, code: code.trim(), newPassword }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to reset password';

      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        errorMessage = `Failed to reset password: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Verify email OTP
   */
  async verifyEmail(userId: string, code: string): Promise<void> {
    // Ensure code is a string and exactly 6 digits
    const otpCode = String(code).trim();
    
    if (!/^\d{6}$/.test(otpCode)) {
      throw new Error('OTP code must be exactly 6 digits');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code: otpCode }),
    });

    if (!response.ok) {
      let errorMessage = 'Email verification failed';
      
      try {
        const errorData = await response.json();
        
        // Handle validation errors (array format from NestJS)
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If JSON parsing fails, use status text
        errorMessage = `Email verification failed: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify device OTP
   */
  async verifyDevice(userId: string, code: string): Promise<void> {
    const deviceFingerprint = this.generateDeviceFingerprint();
    const otpCode = String(code).trim();
    
    if (!/^\d{6}$/.test(otpCode)) {
      throw new Error('OTP code must be exactly 6 digits');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_DEVICE(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-fingerprint': deviceFingerprint,
      },
      credentials: 'include',
      body: JSON.stringify({ code: otpCode }),
    });

    if (!response.ok) {
      let errorMessage = 'Device verification failed';
      
      try {
        const errorData = await response.json();
        
        // Handle validation errors (array format from NestJS)
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If JSON parsing fails, use status text
        errorMessage = `Device verification failed: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
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
   * Activate account with selected plan
   */
  async activateAccount(userId: string, data: ActivateAccountRequest): Promise<ActivateAccountResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.ACTIVATE_ACCOUNT(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Account activation failed',
        statusCode: response.status,
      }));
      console.error('API Error:', errorData);
      let errorMessage = 'Failed to activate account. Please try again.';
      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        } else {
          errorMessage = errorData.message;
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Generate a simple device fingerprint
   */
  private generateDeviceFingerprint(): string {
    // Create a simple fingerprint from available browser info
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 2, 2);
    const canvasFingerprint = canvas.toDataURL();
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvasFingerprint.slice(-20), // Last 20 chars of canvas fingerprint
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const deviceFingerprint = this.generateDeviceFingerprint();
    
    console.log('Attempting login to:', API_ENDPOINTS.AUTH.LOGIN);
    
   
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-fingerprint': deviceFingerprint,
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Login failed',
        statusCode: response.status,
      }));
      console.error('Login API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        } else {
          errorMessage = errorData.message;
        }
      }
      
      // Add status code to error message for 401
      if (response.status === 401) {
        errorMessage = `Unauthorized (401): ${errorMessage}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Login successful, response data:', {
      hasUser: !!data.user,
      requiresDeviceVerification: data.requiresDeviceVerification,
      message: data.message
    });
    
    return data;
  }

  /**
   * Check if email already exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const response = await fetch(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      // If there's an error, assume email doesn't exist to allow registration
      return false;
    }

    const data = await response.json();
    return data.exists === true;
  }

  /**
   * Check if email exists and user has TENANT role
   */
  async checkTenantEmailExists(email: string): Promise<boolean> {
    const response = await fetch(API_ENDPOINTS.AUTH.CHECK_TENANT_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      // If there's an error, assume email doesn't exist
      return false;
    }

    const data = await response.json();
    return data.exists === true;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<CurrentUser> {
    const response = await fetch(API_ENDPOINTS.AUTH.GET_CURRENT_USER, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in.');
      }
      const errorData = await response.json().catch(() => ({
        message: 'Failed to get user information',
      }));
      throw new Error(errorData.message || 'Failed to get user information');
    }

    const data = await response.json();
    return data.user || data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }
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

  /**
   * Update user profile (for OAuth users completing registration)
   */
  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Profile update failed';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Profile update failed: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
  }
}

export const authService = new AuthService();

