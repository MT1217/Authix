import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthHubPage from './pages/AuthHubPage';
import StudentMarketplacePage from './pages/StudentMarketplacePage';
import MentorContentPage from './pages/MentorContentPage';
import AdminPortalPage from './pages/AdminPortalPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthHubPage />} />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute role="student">
            <StudentMarketplacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content"
        element={
          <ProtectedRoute role="mentor">
            <MentorContentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPortalPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
