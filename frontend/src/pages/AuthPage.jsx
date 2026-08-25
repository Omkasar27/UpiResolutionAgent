import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"

function AuthPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get("token")
    const role   = params.get("role")
    const name   = params.get("name")
    const error  = params.get("error")

    console.log("Auth params:", { token: !!token, role, name, error })

    if (error) {
      console.error("Auth error:", error)
      navigate("/login")
      return
    }

    if (!token) {
      console.error("No token found in URL")
      navigate("/login")
      return
    }

    if (!role || !name) {
      console.error("Missing role or name:", { role, name })
      navigate("/login")
      return
    }

    // Save to context
    login(token, { name, role })

    // Redirect based on role
    const destination = role === "admin" ? "/admin" : "/customer"
    console.log("Redirecting to:", destination)

    setTimeout(() => {
      navigate(destination, { replace: true })
    }, 800)

  }, [login, navigate])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-slate-950/30"
        >
          <span className="text-white text-sm font-bold">U</span>
        </motion.div>

        <div className="w-5 h-5 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin mx-auto mb-5" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium text-white mb-1">
            Signing you in
          </p>
          <p className="text-xs text-slate-600 font-mono">
            Setting up your session...
          </p>
        </motion.div>

        <motion.div className="mt-8 w-48 h-px bg-slate-800 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-px bg-slate-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AuthPage