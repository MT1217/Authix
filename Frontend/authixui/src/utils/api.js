const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const tenantId = localStorage.getItem('tenantId') || 'tenant-alpha';
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }
  return response.json();
}
