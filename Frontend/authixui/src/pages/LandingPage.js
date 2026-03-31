import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { useTheme } from '../context/ThemeContext.jsx';

const mentors = [
  { name: 'Elena Park', skill: 'System Design', status: 'Active' },
  { name: 'Ravi Mehta', skill: 'MERN + DevOps', status: 'Paid' },
  { name: 'Sara Bloom', skill: 'Product Thinking', status: 'Pending' },
];

function LandingPage() {
  const { theme } = useTheme();

  return (
    <div className="container">
      <section className="hero">
        <p className="muted">Enterprise Mentorship Cloud</p>
        <h1>Build Tenant-Branded Mentorship Businesses at Scale.</h1>
        <p className="muted">
          Authix delivers multi-tenant role-based mentoring workflows with premium UX.
        </p>
        <p className="muted">Tenant: {theme.tenantId}</p>
        <Link to="/auth">
          <Button>Get Started</Button>
        </Link>
      </section>

      <section className="glass page-section">
        <h2>Featured Mentors</h2>
        <div className="mentor-grid">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="glass mentor-card">
              <h3>{mentor.name}</h3>
              <p className="muted">{mentor.skill}</p>
              <StatusBadge status={mentor.status} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
