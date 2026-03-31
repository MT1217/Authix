import { useState } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

const versions = [
  { name: 'intro-lesson-v1.mp4', status: 'Active' },
  { name: 'system-design-v2.pdf', status: 'Pending' },
  { name: 'api-lifecycle-v3.pptx', status: 'Paid' },
];

function MentorContentPage() {
  const [tab, setTab] = useState('content');

  return (
    <SidebarLayout title="Mentor Workspace">
      <div className="tabs">
        <button className={`tab-btn ${tab === 'content' ? 'active' : ''}`} onClick={() => setTab('content')}>
          Content Studio
        </button>
        <button className={`tab-btn ${tab === 'earnings' ? 'active' : ''}`} onClick={() => setTab('earnings')}>
          Earnings
        </button>
      </div>
      <div className="split">
        {tab === 'content' ? (
          <section className="glass page-section">
            <h3>Upload Center</h3>
            <p className="muted">Manage learning materials and session resources.</p>
            <input className="field" type="file" />
            <div style={{ marginTop: 12 }}>
              <Button>Upload File</Button>
            </div>
          </section>
        ) : (
          <section className="glass page-section">
            <h3>Earnings</h3>
            <p className="muted">Current month payout: $3,240</p>
            <StatusBadge status="Paid" />
          </section>
        )}
        <section className="glass page-section">
          <h3>Version History</h3>
          {versions.map((file) => (
            <div
              key={file.name}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}
            >
              <span>{file.name}</span>
              <StatusBadge status={file.status} />
            </div>
          ))}
        </section>
      </div>
    </SidebarLayout>
  );
}

export default MentorContentPage;
