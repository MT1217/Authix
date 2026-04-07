import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext.jsx';
import Button from '../ui/Button';

const navMap = {
  admin: [{ to: '/admin', label: '🏢 Branding Engine' }],
  mentor: [{ to: '/mentor', label: '👨‍🏫 Content Studio' }],
  student: [{ to: '/dashboard', label: '🎓 My Learning' }],
};

function SidebarLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const links = navMap[user?.role] || [];

  return (
    <div className="app-grid">
      <header className="topbar">
        <strong style={{ fontSize: '1.25rem' }}>{theme.brandName}</strong>
        <Button className="secondary" onClick={() => setOpen((prev) => !prev)}>
          Menu
        </Button>
      </header>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ marginBottom: '40px' }}>
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt={theme.brandName} className="logo-badge" />
          ) : (
            <div className="logo-badge" style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
              {theme.brandName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div style={{ marginLeft: '12px' }}>
            <strong style={{ fontSize: '1.2rem', display: 'block', letterSpacing: '-0.3px' }}>{theme.brandName}</strong>
            <div className="text-gradient" style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user?.role || 'Guest'}
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="muted" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '16px' }}>
            Main Menu
          </div>
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/"
            className="sidebar-link"
            style={{ marginTop: '16px' }}
            onClick={() => setOpen(false)}
          >
            🏠 Back to Landing
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <Button className="secondary" onClick={logout} style={{ width: '100%' }}>
            Logout Securely
          </Button>
        </div>
      </aside>

      <main className="main" style={{ padding: '40px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', letterSpacing: '-0.5px' }}>{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}

export default SidebarLayout;
