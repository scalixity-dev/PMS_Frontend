import React, { createContext, useContext, useMemo, useState } from 'react';

export type AuthUserRole = 'PROPERTY_MANAGER' | 'TENANT' | 'SERVICE_PRO';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: AuthUserRole;
  isEmailVerified: boolean;
  isActive: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: async () => {
    // default no-op
  },
  signOut: async () => {
    // default no-op
  },
});

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signIn = async (nextUser: AuthUser) => {
    setUser(nextUser);
  };

  const signOut = async () => {
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
