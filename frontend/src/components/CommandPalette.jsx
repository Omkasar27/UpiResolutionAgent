import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"

const Icon = ({ d }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

const ICONS = {
  dispute: "M12 4.5v15m7.5-7.5h-15",
  history: "M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h4.5M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z",
  grid:    "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  home:    "M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75",
  login:   "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9",
  logout:  "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
  link:    "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
  search:  "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
}

export function CommandPalette() {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const items = useMemo(() => {
    const go = (path) => () => { navigate(path); setOpen(false) }
    const jump = (hash) => () => {
      setOpen(false)
      if (location.pathname !== "/") { navigate(`/${hash}`); return }
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
    }

    if (user?.role === "admin") {
      return [
        { label: "Overview",     hint: "Admin",  icon: ICONS.grid,  action: go("/admin") },
        { label: "Copy page link", hint: "Clipboard", icon: ICONS.link, action: () => { navigator.clipboard?.writeText(window.location.href); setOpen(false) } },
        { label: "Sign out",     hint: "Session", icon: ICONS.logout, action: () => { logout(); navigate("/login"); setOpen(false) } },
      ]
    }
    if (user?.role === "customer") {
      return [
        { label: "Raise a dispute", hint: "Customer", icon: ICONS.dispute, action: go("/customer") },
        { label: "Copy page link",  hint: "Clipboard", icon: ICONS.link, action: () => { navigator.clipboard?.writeText(window.location.href); setOpen(false) } },
        { label: "Sign out",        hint: "Session", icon: ICONS.logout, action: () => { logout(); navigate("/login"); setOpen(false) } },
      ]
    }
    return [
      { label: "Sign in",      hint: "Auth",     icon: ICONS.login, action: go("/login") },
      { label: "Home",         hint: "Landing",  icon: ICONS.home,  action: go("/") },
      { label: "Features",     hint: "Section",  icon: ICONS.grid,  action: jump("#features") },
      { label: "How it works", hint: "Section",  icon: ICONS.history, action: jump("#how") },
      { label: "Security",     hint: "Section",  icon: ICONS.grid,  action: jump("#security") },
    ]
  }, [user, navigate, location.pathname, logout])

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase())
  )

  const openPalette = () => {
    setQuery("")
    setActive(0)
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  // Global open/close shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (open) setOpen(false)
        else openPalette()
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const onQueryChange = (e) => {
    setQuery(e.target.value)
    setActive(0)
  }

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    if (e.key === "Enter")     { e.preventDefault(); filtered[active]?.action() }
  }

  return (
    <>
      {/* Launcher hint, bottom-right, desktop only */}
      <button
        onClick={openPalette}
        className="hidden md:flex fixed bottom-5 right-5 z-40 items-center gap-2 h-8 px-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-colors duration-150 shadow-lg"
      >
        <Icon d={ICONS.search} />
        <span className="font-mono">Quick actions</span>
        <kbd className="font-mono text-[10px] text-slate-600 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed top-[16%] left-1/2 -translate-x-1/2 z-[61] w-[90vw] max-w-md
                         bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2.5 px-4 h-11 border-b border-slate-800">
                <span className="text-slate-600"><Icon d={ICONS.search} /></span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={onQueryChange}
                  onKeyDown={onKeyDown}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
                />
                <kbd className="font-mono text-[10px] text-slate-600 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5">
                  esc
                </kbd>
              </div>

              <div className="max-h-72 overflow-y-auto p-1.5">
                {filtered.length === 0 ? (
                  <p className="text-center text-xs font-mono text-slate-700 py-8">
                    No matching commands
                  </p>
                ) : (
                  filtered.map((item, i) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      onMouseEnter={() => setActive(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors duration-100 ${
                        i === active
                          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                          : "text-slate-400 border border-transparent"
                      }`}
                    >
                      <span className={i === active ? "text-indigo-400" : "text-slate-600"}>
                        <Icon d={item.icon} />
                      </span>
                      <span className="flex-1 font-medium">{item.label}</span>
                      <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
                        {item.hint}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
