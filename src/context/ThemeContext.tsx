import React, { createContext, useMemo } from 'react';

type Theme = 'light';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
});

const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const value = useMemo<ThemeContextValue>(() => ({
    theme: 'light',
  }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
