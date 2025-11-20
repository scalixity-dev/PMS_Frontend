import React, { createContext, useContext, useMemo, useState } from 'react';

export interface User {
  id: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  signIn: (u?: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (mock: User = { id: '1', name: 'Jane Doe' }) => {
    setUser(mock);
  };

  const signOut = async () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
