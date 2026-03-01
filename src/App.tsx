import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { StudentDashboard } from './features/student/StudentDashboard';
import { AuthProvider } from './services/AuthProvider';
import { AuthPage } from './features/auth/AuthPage';
import { RequireRole } from './services/RequireRole';

function StudentHome() {
  return <div className="p-6">Student portal (coming next)</div>;
}

function AppLanding() {
  return <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/app" element={<AppLanding />} />

          <Route
            path="/student"
            element={
              <RequireRole allow={["student"]}>
                <StudentDashboard />
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}