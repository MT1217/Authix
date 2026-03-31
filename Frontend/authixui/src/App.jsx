import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthHubPage from './pages/AuthHubPage';
import AdminPortalPage from './pages/AdminPortalPage';
import MentorContentPage from './pages/MentorContentPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { getTenantFromHostname } from './utils/tenant';

export { getTenantFromHostname } from './utils/tenant';

function App() {
  useEffect(() => {
    const tenantId = getTenantFromHostname();
    localStorage.setItem('tenantId', tenantId);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthHubPage />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminPortalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/*"
        element={
          <ProtectedRoute role="mentor">
            <MentorContentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute role="student">
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
