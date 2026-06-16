import React, { createContext, useContext, useMemo } from 'react';
import { useGetMyTeams } from '../hooks/useTeamQueries';

interface TeamPermissionContextValue {
  isTeamMember: boolean;
  canView: (module: string) => boolean;
  canManage: (module: string) => boolean;
  permissions: string[];
  isLoading: boolean;
}

const TeamPermissionContext = createContext<TeamPermissionContextValue>({
  isTeamMember: false,
  canView: () => true,
  canManage: () => true,
  permissions: [],
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
        isLoading,
      };
    }

    const permissions: string[] = activeTeam.permissions ?? [];
    const permSet = new Set(permissions);

    return {
      isTeamMember: true,
      permissions,
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
