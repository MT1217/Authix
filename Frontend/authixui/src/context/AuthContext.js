import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { getTenantFromHostname } from '../utils/tenant';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // Align with App.jsx / index bootstrap and clear legacy defaults like tenant-alpha
    localStorage.setItem('tenantId', getTenantFromHostname());
  }, []);

  async function login(payload) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    const nextUser = { role: data.role };
    setUser(nextUser);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(nextUser));
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
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(nextUser));
    return nextUser;
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
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
