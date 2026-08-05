import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"

const customerLinks = [
  {
    label: "Dashboard",
    path:  "/customer",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    )
  },
]

const adminLinks = [
  {
    label: "Dashboard",
    path:  "/admin",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )
  },
]

function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const location          = useLocation()
  const links             = user?.role === "admin" ? adminLinks : customerLinks

  const handleLogout = () => { logout(); navigate("/login") }
  const handleNav    = (path) => { navigate(path); onClose?.() }

  return (
    <aside className="w-60 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="px-5 h-14 flex items-center justify-between border-b border-slate-800">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            UPI Dispute
          </span>
        </a>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-600 hover:text-slate-300 transition"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-mono text-slate-700 tracking-widest uppercase px-2 pb-2 pt-1">
          {user?.role === "admin" ? "Admin" : "Customer"}
        </p>

        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <motion.button
              key={link.path}
              onClick={() => handleNav(link.path)}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                ${isActive
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                }
              `}
            >
              <span className={isActive ? "text-indigo-400" : "text-slate-600"}>
                {link.icon}
              </span>
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 bg-indigo-400 rounded-full" />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 bg-indigo-600/20 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-600 font-mono truncate">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar