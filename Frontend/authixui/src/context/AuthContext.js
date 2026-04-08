import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { getTenantFromHostname } from '../utils/tenant';

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // IMPORTANT:
  // - sessionStorage is per-tab (prevents mentor login overwriting student login in another tab)
  // - localStorage is shared across tabs (causes your exact redirect problem on refresh)
  const [token, setToken] = useState(sessionStorage.getItem('authToken') || '');
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // Align with App.jsx / index bootstrap and clear legacy defaults like tenant-alpha
    localStorage.setItem('tenantId', getTenantFromHostname());
  }, []);

  useEffect(() => {
    // If we have a token but missing user (common after refresh), rebuild role from JWT payload.
    if (token && !user) {
      const payload = decodeJwtPayload(token);
      if (payload?.role) {
        const nextUser = { role: payload.role };
        setUser(nextUser);
        sessionStorage.setItem('authUser', JSON.stringify(nextUser));
      }
    }
  }, [token, user]);

  async function login(payload) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    const nextUser = { role: data.role };
    setUser(nextUser);
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('authUser', JSON.stringify(nextUser));
    return nextUser;
  }

  async function signup(payload) {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    const nextUser = { role: data.role };
    setUser(nextUser);
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('authUser', JSON.stringify(nextUser));
    return nextUser;
  }

  function logout() {
    setToken('');
    setUser(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
  }

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
