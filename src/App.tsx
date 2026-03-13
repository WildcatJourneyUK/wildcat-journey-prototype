import { Routes, Route } from "react-router-dom";
import { AuthRedirect, ProtectedRoute } from "./routes/ProtectedRoute";
import DashboardRouter from "./routes/DashboardRouter";

import StudentDashboard from "./features/student/StudentDashboard";
import AmbassadorDashboard from "./features/ambassador/AmbassadorDashboard";
import AdmissionDashboard from "./features/admission/AdmissionDashboard";

import AuthPage from "./features/auth/AuthPage";
import ProfilePage from "./features/profile/ProfilePage";
import LandingPage from "./features/landing/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<LandingPage/>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

       <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ambassador/dashboard"
        element={
          <ProtectedRoute>
            <AmbassadorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admissions/dashboard"
        element={
          <ProtectedRoute>
            <AdmissionDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}