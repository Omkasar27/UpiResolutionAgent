import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { Card, CardHeader, CardBody } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { StatusBadge, ActionBadge } from "../components/ui/Badge"
import { PageHeader } from "../components/ui/PageHeader"
import { StatCard } from "../components/ui/StatCard"

const FILTERS = ["ALL", "OPEN", "RESOLVED", "PENDING", "ESCALATED"]

const fadeUp = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.25, ease: "easeOut" }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } }
}

function AdminPage() {
  const { user }                    = useAuth()
  const [disputes, setDisputes]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [overriding, setOverriding] = useState(null)
  const [filter, setFilter]         = useState("ALL")
  const [search, setSearch]         = useState("")
  const [selected, setSelected]     = useState(null)

  useEffect(() => {
    fetchDisputes()
    const interval = setInterval(fetchDisputes, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchDisputes = async () => {
    setLoading(true)
    try {
      const res = await api.get("/admin/disputes")
      setDisputes(res.data.disputes)
    } catch {
      console.error("Failed to fetch.")
    } finally {
      setLoading(false)
    }
  }

  const handleOverride = async (dispute_id, action) => {
    setOverriding(`${dispute_id}-${action}`)
    try {
      await api.post(`/admin/disputes/${dispute_id}/override`, { action })
      await fetchDisputes()
      if (selected?.dispute_id === dispute_id) {
        setSelected(prev => ({
          ...prev,
          ai_action: action,
          status: {
            REFUND:   "RESOLVED",
            WAIT:     "PENDING",
            ESCALATE: "ESCALATED"
          }[action]
        }))
      }
    } catch {
      alert("Override failed.")
    } finally {
      setOverriding(null)
    }
  }

  const stats = {
    total:     disputes.length,
    open:      disputes.filter(d => d.status === "OPEN").length,
    resolved:  disputes.filter(d => d.status === "RESOLVED").length,
    pending:   disputes.filter(d => d.status === "PENDING").length,
    escalated: disputes.filter(d => d.status === "ESCALATED").length,
  }

  const STAT_CONFIG = [
    { key: "total",     label: "Total",     filterVal: "ALL"       },
    { key: "open",      label: "Open",      filterVal: "OPEN"      },
    { key: "resolved",  label: "Resolved",  filterVal: "RESOLVED"  },
    { key: "pending",   label: "Pending",   filterVal: "PENDING"   },
    { key: "escalated", label: "Escalated", filterVal: "ESCALATED" },
  ]

  const filtered = disputes
    .filter(d => filter === "ALL" || d.status === filter)
    .filter(d =>
      search === "" ||
      d.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
      d.customer_name?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <motion.div
      className="space-y-8"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp}>
        <PageHeader
          tag="// Admin"
          title="Overview"
          description="Manage and resolve all customer disputes across the platform."
          action={
            <Button variant="secondary" size="sm" onClick={fetchDisputes}>
              Refresh
            </Button>
          }
        />
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {STAT_CONFIG.map((s, i) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats[s.key]}
            index={i}
            active={filter === s.filterVal}
            onClick={() => setFilter(s.filterVal)}
          />
        ))}
      </motion.div>

      {/* ── Main ── */}
      <motion.div
        variants={fadeUp}
        className={`flex gap-5 ${selected ? "lg:flex-row flex-col" : ""}`}
      >
        {/* ── Table ── */}
        <div className="flex-1 min-w-0">
          <Card animate={false}>

            {/* Toolbar */}
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
                  {FILTERS.map(f => (
                    <motion.button
                      key={f}
                      onClick={() => setFilter(f)}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        h-7 px-3 rounded-md text-xs font-mono transition-all duration-150
                        ${filter === f
                          ? "bg-slate-700 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-400"
                        }
                      `}
                    >
                      {f}
                    </motion.button>
                  ))}
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search disputes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-8 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono w-full sm:w-52"
                />
              </div>
            </CardHeader>

            {/* Table */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-mono text-slate-700">
                  Loading disputes...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">
                  No disputes found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Dispute", "Customer", "Amount", "Decision", "Status", "Actions"].map(h => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-[10px] font-mono text-slate-600 uppercase tracking-widest whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((d, i) => (
                        <motion.tr
                          key={d.dispute_id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setSelected(
                            selected?.dispute_id === d.dispute_id ? null : d
                          )}
                          className={`
                            border-b border-slate-800/50 cursor-pointer
                            transition-colors duration-150
                            ${selected?.dispute_id === d.dispute_id
                              ? "bg-indigo-500/5 border-l-2 border-l-indigo-500"
                              : "hover:bg-slate-800/30"
                            }
                            ${i === filtered.length - 1 ? "border-b-0" : ""}
                          `}
                        >
                          {/* Dispute */}
                          <td className="px-5 py-3.5">
                            <p className="text-xs font-mono text-slate-300">
                              #{d.dispute_id}
                            </p>
                            <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                              {d.transaction_id}
                            </p>
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-[10px] text-slate-400 font-bold flex-shrink-0">
                                {d.customer_name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-xs text-slate-400 truncate max-w-20">
                                {d.customer_name || "—"}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-3.5 text-xs font-mono text-slate-500">
                            {d.amount ? `Rs. ${d.amount}` : "—"}
                          </td>

                          {/* Decision */}
                          <td className="px-5 py-3.5">
                            <ActionBadge action={d.ai_action} />
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <StatusBadge status={d.status} />
                          </td>

                          {/* Actions */}
                          <td
                            className="px-5 py-3.5"
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1">
                              {["REFUND", "WAIT", "ESCALATE"].map(action => (
                                <motion.button
                                  key={action}
                                  onClick={() => handleOverride(d.dispute_id, action)}
                                  disabled={!!overriding}
                                  whileHover={{ y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="h-6 px-2 rounded-md border border-slate-700 text-[10px] font-mono text-slate-600 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all disabled:opacity-30 whitespace-nowrap"
                                >
                                  {overriding === `${d.dispute_id}-${action}`
                                    ? "..."
                                    : action
                                  }
                                </motion.button>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {!loading && filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-800">
                <p className="text-[10px] font-mono text-slate-700">
                  Showing {filtered.length} of {disputes.length} disputes
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ── Detail panel ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:w-72 flex-shrink-0"
            >
              <Card animate={false}>
                {/* Panel header */}
                <CardHeader className="flex items-center justify-between">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    Detail
                  </p>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs font-mono text-slate-700 hover:text-slate-400 transition-colors px-2 py-1 hover:bg-slate-800 rounded"
                  >
                    esc
                  </button>
                </CardHeader>

                {/* Data rows */}
                <div className="divide-y divide-slate-800/60">
                  {[
                    { label: "Dispute",     value: `#${selected.dispute_id}`,   mono: true  },
                    { label: "Transaction", value: selected.transaction_id,      mono: true  },
                    { label: "Customer",    value: selected.customer_name,       mono: false },
                    { label: "Amount",      value: selected.amount ? `Rs. ${selected.amount}` : "—", mono: true },
                    { label: "Merchant",    value: selected.merchant_id || "—",  mono: true  },
                    { label: "Date",        value: selected.created_at?.slice(0, 10), mono: true },
                  ].map(r => (
                    <div
                      key={r.label}
                      className="flex items-start justify-between px-5 py-3 gap-4"
                    >
                      <span className="text-[10px] text-slate-700 uppercase tracking-widest font-mono flex-shrink-0">
                        {r.label}
                      </span>
                      <span className={`text-xs text-right text-slate-400 ${r.mono ? "font-mono" : ""}`}>
                        {r.value}
                      </span>
                    </div>
                  ))}

                  {/* Status */}
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-[10px] text-slate-700 uppercase tracking-widest font-mono">
                      Status
                    </span>
                    <StatusBadge status={selected.status} />
                  </div>

                  {/* Decision */}
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-[10px] text-slate-700 uppercase tracking-widest font-mono">
                      Decision
                    </span>
                    <ActionBadge action={selected.ai_action} />
                  </div>

                  {/* Confidence bar */}
                  {selected.ai_confidence && (
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-700 uppercase tracking-widest font-mono">
                          Confidence
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {Math.round(selected.ai_confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                        <motion.div
                          className="h-1 rounded-full bg-indigo-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(selected.ai_confidence * 100)}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  {selected.ai_reason && (
                    <div className="px-5 py-4">
                      <p className="text-[10px] text-slate-700 uppercase tracking-widest font-mono mb-2">
                        Reason
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {selected.ai_reason}
                      </p>
                    </div>
                  )}

                  {/* Issue */}
                  {selected.description && (
                    <div className="px-5 py-4">
                      <p className="text-[10px] text-slate-700 uppercase tracking-widest font-mono mb-2">
                        Issue
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {selected.description}
                      </p>
                    </div>
                  )}

                  {/* Override */}
                  <div className="px-5 py-4">
                    <p className="text-[10px] text-slate-700 uppercase tracking-widest font-mono mb-3">
                      Override decision
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {["REFUND", "WAIT", "ESCALATE"].map(action => (
                        <motion.button
                          key={action}
                          onClick={() => handleOverride(selected.dispute_id, action)}
                          disabled={!!overriding}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          className={`
                            h-8 rounded-lg border text-[10px] font-mono transition-all duration-150
                            disabled:opacity-30
                            ${action === "REFUND"
                              ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                              : action === "WAIT"
                              ? "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                              : "border-red-500/20 text-red-400 hover:bg-red-500/10"
                            }
                          `}
                        >
                          {overriding === `${selected.dispute_id}-${action}`
                            ? "..."
                            : action
                          }
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default AdminPage