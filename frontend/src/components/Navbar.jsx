import { useAuth } from "../context/AuthContext"
import { useLocation } from "react-router-dom"

const PAGE_TITLES = {
  "/customer":         { title: "Raise Dispute",  sub: "Submit a new UPI transaction dispute" },
  "/customer/history": { title: "My Disputes",    sub: "Track the status of your disputes"    },
  "/admin":            { title: "Overview",        sub: "Platform summary and activity"        },
  "/admin/disputes":   { title: "All Disputes",   sub: "Manage and resolve disputes"          },
}

function Navbar({ onMenuClick }) {
  const { user }  = useAuth()
  const location  = useLocation()
  const page      = PAGE_TITLES[location.pathname] || { title: "Dashboard", sub: "" }

  if (!user) return null

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 z-30">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-300 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div>
          <h1 className="text-sm font-semibold text-white leading-none">
            {page.title}
          </h1>
          {page.sub && (
            <p className="text-xs text-slate-500 mt-0.5 hidden md:block">
              {page.sub}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">{user?.role}</span>
        </div>
        <div className="w-7 h-7 bg-indigo-600/20 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}

export default Navbar