import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminView from '../components/dashboard/AdminView';
import MentorView from '../components/dashboard/MentorView';
import StudentView from '../components/dashboard/StudentView';

const views = {
  admin: {
    title: 'Admin Command Center',
    navItems: ['Branding', 'Mentor Approvals', 'Revenue Analytics', 'Tenant Settings'],
    component: <AdminView />,
  },
  mentor: {
    title: 'Mentor Studio',
    navItems: ['CMS', 'Scheduler', 'Student Progress', 'Earnings'],
    component: <MentorView />,
  },
  student: {
    title: 'Student Learning Hub',
    navItems: ['Marketplace', 'Checkout', 'My Courses', 'Progress'],
    component: <StudentView />,
  },
};

function DashboardPage() {
  const { role = 'student' } = useParams();

  const roleView = useMemo(() => views[role] || views.student, [role]);

  return (
    <DashboardLayout role={role.toUpperCase()} navItems={roleView.navItems} title={roleView.title}>
      {roleView.component}
    </DashboardLayout>
  );
}

export default DashboardPage;
