import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';

const ThemeContext = createContext(null);

const defaultTheme = {
  tenantId: 'platform-main',
  brandName: 'Authix',
  logoUrl: '',
  primary: '#3b82f6',
  bgColor: '#0f172a',
};

export function ThemeProvider({ tenantId, children }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    let mounted = true;
    async function loadTheme() {
      try {
        const branding = await apiFetch(`/api/public/branding?tenant=${tenantId}`);
        if (!mounted) return;
        setTheme({
          tenantId,
          brandName: branding.brandName || 'Authix',
          logoUrl: branding.logoUrl || '',
          primary: branding.primaryColor || '#3b82f6',
          bgColor: branding.backgroundColor || '#0f172a',
        });
      } catch (error) {
        if (!mounted) return;
        setTheme((prev) => ({ ...prev, tenantId }));
      }
    }
    loadTheme();
    return () => {
      mounted = false;
    };
  }, [tenantId]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--bg-color', theme.bgColor);
  }, [theme.primary, theme.bgColor]);

  const updateTheme = useCallback((patch) => {
    setTheme((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({ theme, updateTheme }), [theme, updateTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
