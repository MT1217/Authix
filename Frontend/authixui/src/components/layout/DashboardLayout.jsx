import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navMap = {
  admin: [{ to: '/admin', label: 'Admin Settings' }],
  mentor: [{ to: '/content', label: 'Content Manager' }],
  student: [{ to: '/marketplace', label: 'Mentor Marketplace' }],
};

function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const { tenantTheme } = useTheme();
  const links = navMap[user?.role] || [];

  return (
    <div className="app-grid">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-badge">{tenantTheme.logo}</div>
          <div>
            <strong>{tenantTheme.brandName}</strong>
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
          >
            {item.label}
          </NavLink>
        ))}
        <button className="button secondary" onClick={logout}>
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

export default DashboardLayout;
