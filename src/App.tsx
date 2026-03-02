import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./features/auth/AuthPage";
import { LogoutAndRedirect, ProtectedRoute } from "./services/ProtectedRoute";
import StudentDashboard from "./features/student/StudentDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<LogoutAndRedirect />} />
    </Routes>
  );
}