import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext.jsx';

const navMap = {
  admin: [{ to: '/admin', label: 'Branding Engine' }],
  mentor: [{ to: '/mentor', label: 'Content Studio' }],
  student: [{ to: '/dashboard', label: 'My Learning' }],
};

function SidebarLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const links = navMap[user?.role] || [];

  return (
    <div className="app-grid">
      <header className="topbar">
        <strong>{theme.brandName}</strong>
        <button className="button secondary" onClick={() => setOpen((prev) => !prev)}>
          Menu
        </button>
      </header>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt={theme.brandName} className="logo-badge" />
          ) : (
            <div className="logo-badge">{theme.brandName.slice(0, 1)}</div>
          )}
          <div>
            <strong>{theme.brandName}</strong>
            <div className="muted" style={{ fontSize: 12 }}>
              {user?.role || 'guest'}
            </div>
          </div>
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

        <button className="button secondary" onClick={logout} style={{ marginTop: 'auto' }}>
          Logout
        </button>
      </aside>

      <main className="main">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}

export default SidebarLayout;
