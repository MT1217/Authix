import Sidebar from '../components/common/Sidebar';
import { useTheme } from '../context/ThemeContext';

function DashboardLayout({ role, navItems, title, children }) {
  const { tenantTheme } = useTheme();

  return (
    <div className="min-h-screen flex">
      <Sidebar role={role} navItems={navItems} tenantTheme={tenantTheme} />
      <main className="flex-1 p-8">
        <header className="mb-6">
          <p className="text-sm text-slate-300 m-0">Subdomain: {tenantTheme.subdomain}</p>
          <h1 className="m-0 mt-2 text-3xl font-bold text-white">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
