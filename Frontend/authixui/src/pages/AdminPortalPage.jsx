import { useState } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useTheme } from '../context/ThemeContext.jsx';

function AdminPortalPage() {
  const { theme, updateTheme } = useTheme();
  const [color, setColor] = useState(theme.primary);
  const [bgColor, setBgColor] = useState(theme.bgColor);

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

      </div>
    </SidebarLayout>
  );
}

export default AdminPortalPage;
