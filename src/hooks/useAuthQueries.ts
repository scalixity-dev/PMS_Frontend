import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, type RegisterRequest, type RegisterResponse, type UpdateProfileRequest } from '../services/auth.service';

// Query keys for React Query
export const authQueryKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authQueryKeys.all, 'currentUser'] as const,
  emailCheck: (email: string) => [...authQueryKeys.all, 'emailCheck', email] as const,
};

/**
 * Hook to check if email exists
 */
export const useCheckEmailExists = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: authQueryKeys.emailCheck(email),
    queryFn: () => authService.checkEmailExists(email),
    enabled: enabled && !!email,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

/**
 * Hook to get current user
 */
export const useGetCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to register a new user
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest): Promise<RegisterResponse> => {
      return authService.register(data);
    },
    onSuccess: () => {
      // Invalidate and refetch current user after successful registration
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest): Promise<void> => {
      return authService.updateProfile(data);
    },
    onSuccess: () => {
      // Invalidate current user to refetch updated data
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser() });
    },
  });
};

