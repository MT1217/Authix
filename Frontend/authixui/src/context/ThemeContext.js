import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tenantTheme, setTenantTheme] = useState({
    logo: 'A',
    brandName: 'Authix',
    primary: '#3b82f6',
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', tenantTheme.primary);
  }, [tenantTheme.primary]);

  const updateBranding = useCallback((next) => {
    setTenantTheme((prev) => ({ ...prev, ...next }));
  }, []);

  const value = useMemo(
    () => ({
      tenantTheme,
      updateBranding,
    }),
    [tenantTheme, updateBranding]
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
