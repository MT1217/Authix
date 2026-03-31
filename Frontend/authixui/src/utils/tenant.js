/**
 * Must match backend seed subdomain and App.jsx logic so x-tenant-id always resolves a real Tenant.
 */
export function getTenantFromHostname(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  const localHosts = ['localhost', '127.0.0.1'];
  if (!hostname || localHosts.includes(hostname) || hostname.split('.').length < 3) {
    return 'platform-main';
  }
  return hostname.split('.')[0] || 'platform-main';
}

/** Value sent on every API call — prefer localStorage, then hostname (never use a stale default). */
export function getActiveTenantId() {
  if (typeof window === 'undefined') return 'platform-main';
  const stored = localStorage.getItem('tenantId');
  if (stored && stored.trim()) return stored.trim();
  const derived = getTenantFromHostname();
  localStorage.setItem('tenantId', derived);
  return derived;
}
