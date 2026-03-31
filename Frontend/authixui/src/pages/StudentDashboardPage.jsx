import { useEffect, useState } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import Button from '../components/ui/Button';
import { apiFetch } from '../utils/api';

function StudentDashboardPage() {
  const [tab, setTab] = useState('learning');
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    apiFetch('/api/student/marketplace')
      .then(setMentors)
      .catch(() =>
        setMentors([
          { _id: '1', title: 'Fullstack with Ria', description: 'Paid content + weekly calls' },
          { _id: '2', title: 'Product Mentoring with Alex', description: 'Portfolio mentorship' },
        ])
      );
  }, []);

  return (
    <SidebarLayout title="Student Dashboard">
      <div className="tabs">
        <button className={`tab-btn ${tab === 'learning' ? 'active' : ''}`} onClick={() => setTab('learning')}>
          My Learning
        </button>
        <button className={`tab-btn ${tab === 'marketplace' ? 'active' : ''}`} onClick={() => setTab('marketplace')}>
          Marketplace
        </button>
      </div>

      {tab === 'learning' ? (
        <section className="glass page-section">
          <h3>My Learning</h3>
          <p className="muted">Access your paid courses, recorded sessions, and downloadable materials.</p>
        </section>
      ) : (
        <section className="glass page-section">
          <h3>Mentor Marketplace</h3>
          <div className="mentor-grid">
            {mentors.map((mentor) => (
              <article className="glass mentor-card" key={mentor._id}>
                <h4>{mentor.title}</h4>
                <p className="muted">{mentor.description}</p>
                <Button>Book Session</Button>
              </article>
            ))}
          </div>
        </section>
      )}
    </SidebarLayout>
  );
}

export default StudentDashboardPage;
