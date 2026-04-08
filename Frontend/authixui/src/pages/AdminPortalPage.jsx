import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useTheme } from '../context/ThemeContext.jsx';
import { apiFetch } from '../utils/api';

function AdminPortalPage() {
  const { theme, updateTheme } = useTheme();
  const [color, setColor] = useState(theme.primary);
  const [bgColor, setBgColor] = useState(theme.bgColor);
  const [overview, setOverview] = useState(null);
  const mentorRows = useMemo(() => overview?.mentors || [], [overview]);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(String(text || ''));
    } catch {
      // ignore clipboard errors (permissions)
    }
  }

  useEffect(() => {
    apiFetch('/api/admin/overview')
      .then(setOverview)
      .catch(() => {
        setOverview(null);
      });
  }, []);

  return (
    <SidebarLayout title="Admin Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        <section className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Branding Engine</h3>
            <p className="muted" style={{ lineHeight: '1.5' }}>
              Customize your tenant's look. Changes apply to CSS variables in real-time across the entire organization.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Primary Accent Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  style={{ width: '60px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, background: 'transparent' }}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const next = e.target.value;
                    setColor(next);
                    updateTheme({ primary: next });
                  }}
                />
                <span className="muted" style={{ fontFamily: 'monospace' }}>{color}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Background Theme Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  style={{ width: '60px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, background: 'transparent' }}
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    const next = e.target.value;
                    setBgColor(next);
                    updateTheme({ bgColor: next });
                  }}
                />
                <span className="muted" style={{ fontFamily: 'monospace' }}>{bgColor}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Company Overview</h3>
          <p className="muted" style={{ marginBottom: '18px' }}>
            Tenant-scoped metrics and mentor directory (logically isolated by `tenantId`).
          </p>

          {overview ? (
            <>
              <div className="glass-panel" style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.06em' }}>ORGANIZATION</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900 }}>{overview.tenantName || 'Your Organization'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className="muted" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Tenant ID (immutable)</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 800 }}>
                        {String(overview.tenantId || '')}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => copy(overview.tenantId)}
                      style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      Copy ID
                    </button>
                    {overview.tenantSubdomain && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => copy(overview.tenantSubdomain)}
                        style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        Copy Subdomain
                      </button>
                    )}
                  </div>
                </div>
                <div className="muted" style={{ marginTop: '10px', fontSize: '0.9rem', lineHeight: 1.45 }}>
                  Share this Tenant ID with mentors once during their first login to securely link them to your organization.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
                <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mentors</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{overview.mentorsCount}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Students</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{overview.studentsCount}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Revenue (Gross)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>${overview.revenue?.gross || 0}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Content</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{overview.progress?.contentCount || 0}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Submissions</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{overview.progress?.submissionsTotal || 0}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Evaluation Rate</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{overview.progress?.evaluationRate || 0}%</div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="table glass">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Expertise</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentorRows.map((m) => (
                      <tr key={m._id}>
                        <td>{m.profile?.name || '-'}</td>
                        <td>{m.email}</td>
                        <td>{m.profile?.expertise || '-'}</td>
                        <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                    {mentorRows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="muted">
                          No mentors found for this organization yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="muted">Overview not available (login as Admin for this tenant).</p>
          )}
        </section>

      </div>
    </SidebarLayout>
  );
}

export default AdminPortalPage;
