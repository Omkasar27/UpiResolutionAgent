import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

function LoginPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/customer")
  }, [user])

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/login"
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Left panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-slate-800"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            UPI Dispute
          </span>
        </a>

        {/* Content */}
        <div className="max-w-sm">
          <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-6">
            // Platform
          </p>
          <h2 className="text-3xl font-semibold text-white tracking-tight leading-snug mb-4">
            AI-powered dispute resolution for UPI transactions.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-10">
            A structured mediation layer between customers, merchants,
            and banks. Every dispute is verified and resolved automatically.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Dual-source bank and merchant verification",
              "AI decision with confidence scoring",
              "Full audit trail and admin override",
              "JWT-secured role-based access",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
                <p className="text-sm text-slate-400">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-700 font-mono">v1.0.0 — 2026</p>
      </motion.div>

      {/* ── Right panel ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <a href="/" className="flex lg:hidden items-center gap-2.5 mb-12">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <span className="text-sm font-semibold text-white">UPI Dispute</span>
          </a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
              Sign in
            </h1>
            <p className="text-sm text-slate-500">
              Continue with your Google account to access the platform.
            </p>
          </motion.div>

          {/* Google button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <motion.button
              onClick={handleLogin}
              whileHover={{ y: -2, borderColor: "rgba(99,102,241,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-10 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors duration-150"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 my-6"
          >
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-700 font-mono">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </motion.div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4"
          >
            <p className="text-xs text-slate-600 leading-relaxed">
              This platform uses Google OAuth for authentication.
              No passwords stored. Sessions secured with signed JWT tokens.
            </p>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mt-8 pt-8 border-t border-slate-800"
          >
            {[
              { label: "OAuth 2.0",  sub: "Auth"     },
              { label: "JWT",        sub: "Sessions"  },
              { label: "Role-based", sub: "Access"    },
            ].map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="text-center"
              >
                <p className="text-xs font-semibold text-slate-400 font-mono">
                  {t.label}
                </p>
                <p className="text-xs text-slate-700 mt-0.5">{t.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Back */}
          <p className="text-center mt-8">
            <a
              href="/"
              className="text-xs text-slate-700 hover:text-slate-400 transition-colors"
            >
              Back to homepage
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage