import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-screen z-40 transition-transform duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <main className="lg:ml-60 pt-14 min-h-screen">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout