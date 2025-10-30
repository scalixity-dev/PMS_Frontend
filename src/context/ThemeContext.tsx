import React, { createContext, useContext, useMemo } from 'react';

export type Theme = 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const value = useMemo<ThemeContextValue>(() => ({
    theme: 'light',
    setTheme: () => {},
    toggleTheme: () => {},
  }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
