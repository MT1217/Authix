import { createContext, useContext, useMemo, useState } from 'react';
import { mockTenant } from '../data/mockTenant';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tenantTheme, setTenantTheme] = useState(mockTenant);

  const value = useMemo(
    () => ({
      tenantTheme,
      setTenantTheme,
    }),
    [tenantTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
