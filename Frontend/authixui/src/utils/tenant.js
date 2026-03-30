export function getTenantFromUrl() {
  const query = new URLSearchParams(window.location.search);
  const queryTenant = query.get('tenant');
  if (queryTenant) return queryTenant;

  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0];
  }

  return 'tenant-alpha';
}
