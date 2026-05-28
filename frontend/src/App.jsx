import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import DashboardLayout from "./components/DashboardLayout"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import AuthPage from "./pages/AuthPage"
import CustomerPage from "./pages/CustomerPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth"  element={<AuthPage />} />

        {/* Customer */}
        <Route path="/customer" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CustomerPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AdminPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App