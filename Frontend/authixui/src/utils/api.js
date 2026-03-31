import { getActiveTenantId } from './tenant';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const tenantId = getActiveTenantId();
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { message: text || 'Unknown error' };
  }

  if (!response.ok) {
    const msg = body?.message || `API Error ${response.status}`;
    const err = new Error(msg);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

export { API_BASE };
