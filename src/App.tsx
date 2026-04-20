import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth-context";
import { ProtectedRoute } from "./components/auth/protected-route";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import { Toaster } from "sonner";

// Pages
import LoginPage from "./pages/login/login-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import MaterialIssuePage from "./pages/material-issue/material-issue-page";
import ConsumptionPage from "./pages/consumption/consumption-page";
import AIAssistantPage from "./pages/ai-assistant/ai-assistant-page";
import OperatorDashboard from "./pages/dashboard/operator-dashboard";
import SupervisorDashboard from "./pages/dashboard/supervisor-dashboard";


// 🔥 ROLE-BASED DASHBOARD SWITCHER
function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "admin") return <DashboardPage />;
  if (user.role === "operator") return <OperatorDashboard />;
  if (user.role === "supervisor") return <SupervisorDashboard />;

  return <div>Unauthorized</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* PUBLIC */}
          <Route path="/login" element={<LoginPage />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RoleBasedDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* MATERIAL ISSUE (Operator + Admin) */}
          <Route
            path="/material-issue"
            element={
              <ProtectedRoute allowedRoles={["operator", "admin"]}>
                <DashboardLayout>
                  <MaterialIssuePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* CONSUMPTION (Admin + Supervisor) */}
          <Route
            path="/consumption"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <DashboardLayout>
                  <ConsumptionPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* AI (ALL ROLES) */}
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AIAssistantPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Router>

      <Toaster position="top-right" theme="dark" richColors />
    </AuthProvider>
  );
}