import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { MotionConfig } from "framer-motion"
import { AuthProvider } from "./context/AuthContext"
import DashboardLayout from "./components/DashboardLayout"
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { CommandPalette } from "./components/CommandPalette"
import "./index.css"

const LoginPage = lazy(() => import("./pages/LoginPage"))
const AuthPage = lazy(() => import("./pages/AuthPage"))
const CustomerPage = lazy(() => import("./pages/CustomerPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

function RouteFallback() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center" aria-label="Loading page">
      <div className="h-5 w-5 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <CommandPalette />
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </AuthProvider>
    </MotionConfig>
  )
}

export default App