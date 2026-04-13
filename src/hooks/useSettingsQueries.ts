import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import type { SettingsSection } from '../services/settings.service';

export const settingsQueryKeys = {
  all: ['settings'] as const,
  section: (section: SettingsSection) => [...settingsQueryKeys.all, section] as const,
  securitySessions: () => [...settingsQueryKeys.all, 'security-sessions'] as const,
};

export const useGetSettingsSection = <T = Record<string, unknown>>(
  section: SettingsSection,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: settingsQueryKeys.section(section),
    queryFn: () => settingsService.getSection<T>(section),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useUpdateSettingsSection = <T extends object = Record<string, unknown>>(section: SettingsSection) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: T) => settingsService.updateSection<T>(section, values as Record<string, unknown>),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.section(section), data);
    },
  });
};

export const useGetSecuritySessions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: settingsQueryKeys.securitySessions(),
    queryFn: () => settingsService.getSecuritySessions(),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
};
