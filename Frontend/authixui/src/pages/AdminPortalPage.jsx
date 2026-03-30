import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DataTable from '../components/ui/DataTable';
import { useTheme } from '../context/ThemeContext';

const columns = [
  { key: 'mentor', title: 'Mentor' },
  { key: 'gross', title: 'Gross' },
  { key: 'mentorShare', title: 'Mentor (90%)' },
  { key: 'platformShare', title: 'Platform (10%)' },
];

const rows = [
  { id: 1, mentor: 'Ravi', gross: '$1200', mentorShare: '$1080', platformShare: '$120' },
  { id: 2, mentor: 'Elena', gross: '$980', mentorShare: '$882', platformShare: '$98' },
];

function AdminPortalPage() {
  const { tenantTheme, updateBranding } = useTheme();
  const [color, setColor] = useState(tenantTheme.primary);
  const [logo, setLogo] = useState(tenantTheme.logo);

  return (
    <DashboardLayout title="Admin Settings">
      <div className="split">
        <section className="glass page-section">
          <h3>Branding Engine</h3>
          <p className="muted">Changes apply to root CSS variables in real-time.</p>
          <label>
            Primary Accent
            <input
              className="field"
              type="color"
              value={color}
              onChange={(e) => {
                const next = e.target.value;
                setColor(next);
                updateBranding({ primary: next });
              }}
            />
          </label>
          <label>
            Logo Text
            <input
              className="field"
              value={logo}
              onChange={(e) => {
                const next = e.target.value.slice(0, 2).toUpperCase();
                setLogo(next);
                updateBranding({ logo: next });
              }}
            />
          </label>
        </section>
        <section className="glass page-section">
          <h3>Revenue Table</h3>
          <DataTable columns={columns} rows={rows} />
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminPortalPage;
