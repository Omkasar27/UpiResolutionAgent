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

    if (error || !token) {
      navigate("/login")
      return
    }

    login(token, { name, role })
    setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/customer")
    }, 800)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/20"
        >
          <span className="text-white text-sm font-bold">U</span>
        </motion.div>

        {/* Spinner */}
        <div className="w-5 h-5 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin mx-auto mb-5" />

        {/* Text */}
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

        {/* Progress bar */}
        <motion.div
          className="mt-8 w-48 h-px bg-slate-800 rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            className="h-px bg-indigo-500 rounded-full"
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