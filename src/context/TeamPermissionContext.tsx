import React, { createContext, useContext, useMemo } from 'react';
import { useGetMyTeams } from '../hooks/useTeamQueries';

interface TeamPermissionContextValue {
  isTeamMember: boolean;
  canView: (module: string) => boolean;
  canManage: (module: string) => boolean;
  permissions: string[];
  assignedPropertyIds: string[] | null; // null = no restriction (owner), [] = no properties assigned
  isLoading: boolean;
}

const TeamPermissionContext = createContext<TeamPermissionContextValue>({
  isTeamMember: false,
  canView: () => true,
  canManage: () => true,
  permissions: [],
  assignedPropertyIds: null,
  isLoading: false,
});

export const TeamPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: myTeams, isLoading } = useGetMyTeams();

  const value = useMemo<TeamPermissionContextValue>(() => {
    const activeTeam = myTeams?.find((t: any) => t.status === 'ACTIVE');

    if (!activeTeam) {
      return {
        isTeamMember: false,
        canView: () => true,
        canManage: () => true,
        permissions: [],
        assignedPropertyIds: null,
        isLoading,
      };
    }

    const permissions: string[] = activeTeam.permissions ?? [];
    const permSet = new Set(permissions);
    const assignedPropertyIds: string[] = activeTeam.propertyIds ?? [];

    return {
      isTeamMember: true,
      permissions,
      assignedPropertyIds,
      canView: (module: string) =>
        permSet.has(`${module}:view`) || permSet.has(`${module}:manage`),
      canManage: (module: string) => permSet.has(`${module}:manage`),
      isLoading,
    };
  }, [myTeams, isLoading]);

  return (
    <TeamPermissionContext.Provider value={value}>
      {children}
    </TeamPermissionContext.Provider>
  );
};

export function useTeamPermissions(): TeamPermissionContextValue {
  return useContext(TeamPermissionContext);
}
