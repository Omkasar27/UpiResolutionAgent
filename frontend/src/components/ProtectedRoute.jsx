import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  // Wait for localStorage to load
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute