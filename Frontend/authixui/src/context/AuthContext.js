import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { getTenantFromHostname } from '../utils/tenant';
import { API_BASE } from '../utils/api';

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
    // Initialize tenant only if missing; never overwrite an authenticated tenant context.
    const existing = sessionStorage.getItem('tenantId') || localStorage.getItem('tenantId');
    if (!existing) {
      const derived = getTenantFromHostname();
      sessionStorage.setItem('tenantId', derived);
      localStorage.setItem('tenantId', derived);
    }
  }, []);

  useEffect(() => {
    // If we have a token but missing user (common after refresh), rebuild role from JWT payload.
    if (token && !user) {
      const payload = decodeJwtPayload(token);
      if (payload?.role) {
        const nextUser = { role: payload.role, userId: payload.userId || '' };
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

    // Persist resolved tenant for subsequent sessions/tabs.
    if (data?.tenantSubdomain) {
      sessionStorage.setItem('tenantId', data.tenantSubdomain);
      localStorage.setItem('tenantId', data.tenantSubdomain);
    } else if (data?.tenantId) {
      sessionStorage.setItem('tenantId', data.tenantId);
      localStorage.setItem('tenantId', data.tenantId);
    }

    setToken(data.token);
    const jwtPayload = decodeJwtPayload(data.token);
    const nextUser = {
      role: data.role,
      name: data.name || '',
      userId: jwtPayload?.userId || '',
    };
    setUser(nextUser);
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('authUser', JSON.stringify(nextUser));
    return nextUser;
  }

  /**
   * First-time mentor onboarding with required orgId (tenant selector).
   */
  async function mentorRegister({ orgId, email, password, name, expertise }) {
    const response = await fetch(`${API_BASE}/api/public/auth/mentor-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, email, password, name, expertise }),
    });

    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { message: text || 'Unknown error' };
    }

    if (!response.ok) {
      const err = new Error(body?.message || `API Error ${response.status}`);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    // Persist tenant so subsequent logins do not require orgId again.
    if (body?.tenantSubdomain) {
      sessionStorage.setItem('tenantId', body.tenantSubdomain);
      localStorage.setItem('tenantId', body.tenantSubdomain);
    } else if (body?.tenantId) {
      sessionStorage.setItem('tenantId', body.tenantId);
      localStorage.setItem('tenantId', body.tenantId);
    }

    setToken(body.token);
    const jwtPayload = decodeJwtPayload(body.token);
    const nextUser = {
      role: body.role,
      name: body.name || '',
      userId: jwtPayload?.userId || '',
    };
    setUser(nextUser);
    sessionStorage.setItem('authToken', body.token);
    sessionStorage.setItem('authUser', JSON.stringify(nextUser));
    return nextUser;
  }

  /**
   * Bootstrap a brand new organization (Tenant) + owner Admin user.
   * Public endpoint: does not require x-tenant-id header.
   */
  async function adminRegister({ email, ownerName, password }) {
    const response = await fetch(`${API_BASE}/api/public/auth/admin-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ownerName, password }),
    });

    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { message: text || 'Unknown error' };
    }

    if (!response.ok) {
      const err = new Error(body?.message || `API Error ${response.status}`);
      err.status = response.status;
      err.body = body;
      throw err;
    }

    // Persist the new tenant immediately so admin-scoped API calls work.
    if (body?.tenantSubdomain) {
      sessionStorage.setItem('tenantId', body.tenantSubdomain);
      localStorage.setItem('tenantId', body.tenantSubdomain);
    } else if (body?.tenantId) {
      sessionStorage.setItem('tenantId', body.tenantId);
      localStorage.setItem('tenantId', body.tenantId);
    }

    setToken(body.token);
    const jwtPayload = decodeJwtPayload(body.token);
    const nextUser = {
      role: body.role,
      name: body.name || '',
      userId: jwtPayload?.userId || '',
    };
    setUser(nextUser);
    sessionStorage.setItem('authToken', body.token);
    sessionStorage.setItem('authUser', JSON.stringify(nextUser));
    return nextUser;
  }

  async function signup(payload) {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data?.tenantSubdomain) {
      sessionStorage.setItem('tenantId', data.tenantSubdomain);
      localStorage.setItem('tenantId', data.tenantSubdomain);
    } else if (data?.tenantId) {
      sessionStorage.setItem('tenantId', data.tenantId);
      localStorage.setItem('tenantId', data.tenantId);
    }

    setToken(data.token);
    const jwtPayload = decodeJwtPayload(data.token);
    const nextUser = {
      role: data.role,
      name: data.name || payload?.name || '',
      userId: jwtPayload?.userId || '',
    };
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
      mentorRegister,
      adminRegister,
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
