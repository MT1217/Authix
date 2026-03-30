import { NavLink } from 'react-router-dom';

function Sidebar({ role, navItems, tenantTheme }) {
  return (
    <aside className="w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg grid place-items-center text-lg font-bold text-white"
            style={{ backgroundColor: tenantTheme.primaryColor }}
          >
            {tenantTheme.logo}
          </div>
          <div>
            <p className="m-0 text-sm text-slate-300 uppercase tracking-wider">{role}</p>
            <h2 className="m-0 text-white text-lg font-semibold">{tenantTheme.name}</h2>
          </div>
        </div>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item}
            to="#"
            className="block rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            {item}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
