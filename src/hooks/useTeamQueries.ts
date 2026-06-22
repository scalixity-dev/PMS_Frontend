import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService, type InviteTeamMemberDto, type UpdateTeamMemberDto } from '../services/team.service';

export const teamQueryKeys = {
  all: ['team'] as const,
  lists: () => [...teamQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...teamQueryKeys.all, 'detail', id] as const,
  myTeams: () => [...teamQueryKeys.all, 'my-teams'] as const,
};

export const useGetTeamMembers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: teamQueryKeys.lists(),
    queryFn: () => teamService.getAll(),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetTeamMember = (id: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: id ? teamQueryKeys.detail(id) : [...teamQueryKeys.all, 'detail', 'null'],
    queryFn: () => teamService.getOne(id!),
    enabled: enabled && !!id,
    staleTime: 60 * 1000,
  });
};

export const useGetMyTeams = (enabled: boolean = true) => {
  return useQuery({
    queryKey: teamQueryKeys.myTeams(),
    queryFn: () => teamService.getMyTeams(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
};

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: InviteTeamMemberDto) => teamService.invite(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTeamMemberDto }) =>
      teamService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.detail(variables.id) });
    },
  });
};

export const useRevokeTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamService.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
    },
  });
};

export const useEnableTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamService.enable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
    },
  });
};

export const useResendInvitation = () => {
  return useMutation({
    mutationFn: (id: string) => teamService.resendInvitation(id),
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.lists() });
    },
  });
};

export const useGetInvitation = (token: string | null) => {
  return useQuery({
    queryKey: [...teamQueryKeys.all, 'invitation', token],
    queryFn: () => teamService.getInvitation(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      teamService.acceptInvitation(token, password),
  });
};
