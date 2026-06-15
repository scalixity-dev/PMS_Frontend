import React, { createContext, useContext, useMemo } from 'react';
import { useGetMyTeams } from '../hooks/useTeamQueries';

interface TeamPermissionContextValue {
  isTeamMember: boolean;
  canView: (module: string) => boolean;
  canManage: (module: string) => boolean;
  permissions: string[];
}

const TeamPermissionContext = createContext<TeamPermissionContextValue>({
  isTeamMember: false,
  canView: () => true,
  canManage: () => true,
  permissions: [],
});

export const TeamPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: myTeams } = useGetMyTeams();

  const value = useMemo<TeamPermissionContextValue>(() => {
    const activeTeam = myTeams?.find((t: any) => t.status === 'ACTIVE');

    if (!activeTeam) {
      return {
        isTeamMember: false,
        canView: () => true,
        canManage: () => true,
        permissions: [],
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
    };
  }, [myTeams]);

  return (
    <TeamPermissionContext.Provider value={value}>
      {children}
    </TeamPermissionContext.Provider>
  );
};

export function useTeamPermissions(): TeamPermissionContextValue {
  return useContext(TeamPermissionContext);
}
