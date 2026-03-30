import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { apiFetch } from '../utils/api';

function StudentMarketplacePage() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    apiFetch('/api/student/marketplace')
      .then(setMentors)
      .catch(() => {
        setMentors([
          { _id: 'm1', title: 'React Masterclass', description: 'Weekly live sessions' },
          { _id: 'm2', title: 'MERN Intensive', description: 'Project-based learning' },
        ]);
      });
  }, []);

  return (
    <DashboardLayout title="Student Marketplace">
      <div className="mentor-grid">
        {mentors.map((mentor) => (
          <article className="glass mentor-card" key={mentor._id}>
            <h3>{mentor.title}</h3>
            <p className="muted">{mentor.description}</p>
            <Button>Book Session</Button>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default StudentMarketplacePage;
