import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

const versions = [
  { name: 'intro-lesson-v1.mp4', status: 'Active' },
  { name: 'system-design-v2.pdf', status: 'Pending' },
  { name: 'api-lifecycle-v3.pptx', status: 'Paid' },
];

function MentorContentPage() {
  return (
    <DashboardLayout title="Mentor Content Studio">
      <div className="split">
        <section className="glass page-section">
          <h3>Upload Center</h3>
          <p className="muted">Manage learning materials and session resources.</p>
          <input className="field" type="file" />
          <div style={{ marginTop: 12 }}>
            <Button>Upload File</Button>
          </div>
        </section>
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
    </DashboardLayout>
  );
}

export default MentorContentPage;
