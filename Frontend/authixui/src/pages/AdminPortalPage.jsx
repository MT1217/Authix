import { useState } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import DataTable from '../components/ui/DataTable';
import { useTheme } from '../context/ThemeContext.jsx';

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
  const { theme, updateTheme } = useTheme();
  const [color, setColor] = useState(theme.primary);
  const [bgColor, setBgColor] = useState(theme.bgColor);

  return (
    <SidebarLayout title="Admin Dashboard">
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
                updateTheme({ primary: next });
              }}
            />
          </label>
          <label>
            Background Color
            <input
              className="field"
              type="color"
              value={bgColor}
              onChange={(e) => {
                const next = e.target.value;
                setBgColor(next);
                updateTheme({ bgColor: next });
              }}
            />
          </label>
        </section>
        <section className="glass page-section">
          <h3>Revenue Table</h3>
          <DataTable columns={columns} rows={rows} />
        </section>
      </div>
    </SidebarLayout>
  );
}

export default AdminPortalPage;
