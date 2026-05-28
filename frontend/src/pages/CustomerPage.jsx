import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { Card, CardHeader, CardBody } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input, Textarea } from "../components/ui/Input"
import { StatusBadge, ActionBadge } from "../components/ui/Badge"
import { PageHeader } from "../components/ui/PageHeader"

const TEST_IDS = ["TXN001", "TXN002", "TXN003", "TXN004", "TXN005"]

const fadeUp = {
  initial:   { opacity: 0, y: 12 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.25, ease: "easeOut" }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } }
}

function CustomerPage() {
  const { user } = useAuth()

  const [form, setForm]               = useState({ transaction_id: "", description: "" })
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [result, setResult]           = useState(null)
  const [myDisputes, setMyDisputes]   = useState([])
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => { fetchMyDisputes() }, [])

  const fetchMyDisputes = async () => {
    setLoadingList(true)
    try {
      const res = await api.get("/disputes/my")
      setMyDisputes(res.data.disputes)
    } catch {
      console.error("Failed to load.")
    } finally {
      setLoadingList(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.transaction_id.trim()) {
      setError("Transaction ID is required.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res       = await api.post("/disputes", form)
      const verifyRes = await api.post(`/disputes/${res.data.dispute_id}/verify`)
      setResult(verifyRes.data)
      fetchMyDisputes()
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

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
          tag="// Dispute"
          title="Raise a dispute"
          description="Submit a transaction ID and our AI agent will analyze and resolve your case instantly."
        />
      </motion.div>

      {/* ── Two column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Left: Form ── */}
        <motion.div variants={fadeUp} className="lg:col-span-3 space-y-4">

          {/* Form card */}
          <Card>
            <CardHeader>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                Transaction details
              </p>
            </CardHeader>
            <CardBody className="space-y-5">

              {/* Transaction ID input */}
              <div>
                <Input
                  label="Transaction ID"
                  placeholder="e.g. TXN001"
                  value={form.transaction_id}
                  onChange={e => setForm({ ...form, transaction_id: e.target.value })}
                  hint="Enter your UPI transaction ID"
                />

                {/* Quick select */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {TEST_IDS.map(id => (
                    <motion.button
                      key={id}
                      onClick={() => setForm({ ...form, transaction_id: id })}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      className={`
                        h-7 px-3 rounded-md text-xs font-mono transition-all duration-150 border
                        ${form.transaction_id === id
                          ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/40"
                          : "text-slate-600 border-slate-800 hover:border-slate-700 hover:text-slate-400 bg-slate-900"
                        }
                      `}
                    >
                      {id}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <Textarea
                label={<>Description <span className="text-slate-700 normal-case tracking-normal">(optional)</span></>}
                placeholder="Describe the issue with this transaction..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
              />

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                loading={loading}
                size="md"
                className="w-full"
              >
                {loading ? "Analyzing..." : "Submit dispute"}
              </Button>
            </CardBody>
          </Card>

          {/* How it works */}
          <Card>
            <CardBody>
              <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-4">
                // How it works
              </p>
              <div className="space-y-4">
                {[
                  { step: "01", text: "Enter your UPI transaction ID" },
                  { step: "02", text: "AI agent queries bank and merchant data simultaneously" },
                  { step: "03", text: "Decision returned — refund, wait, or escalate" },
                ].map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-xs font-mono text-slate-700 w-4 flex-shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div className="flex-1">
                      <div className="h-px bg-slate-800 mb-3" />
                      <p className="text-sm text-slate-400">{s.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* ── Right: Result ── */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                      AI Decision
                    </p>
                    <ActionBadge action={result.ai_action} />
                  </CardHeader>

                  <div className="divide-y divide-slate-800/60">

                    {/* Data rows */}
                    {[
                      { label: "Dispute ID",  value: `#${result.dispute_id}`,  mono: true },
                      { label: "Transaction", value: result.transaction_id,     mono: true },
                    ].map(r => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <span className="text-xs text-slate-600">{r.label}</span>
                        <span className={`text-xs text-slate-300 ${r.mono ? "font-mono" : ""}`}>
                          {r.value}
                        </span>
                      </div>
                    ))}

                    {/* Status */}
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-xs text-slate-600">Status</span>
                      <StatusBadge status={result.dispute_status} />
                    </div>

                    {/* Confidence */}
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-600">Confidence</span>
                        <span className="text-xs font-mono text-slate-400">
                          {Math.round(result.ai_confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                        <motion.div
                          className="h-1 rounded-full bg-indigo-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(result.ai_confidence * 100)}%` }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="px-5 py-4">
                      <p className="text-xs text-slate-600 mb-2">Reason</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {result.ai_reason}
                      </p>
                    </div>

                    {/* Refund */}
                    {result.refund && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="px-5 py-4 bg-emerald-500/5 border-t border-emerald-500/10"
                      >
                        <p className="text-xs font-mono text-emerald-400 mb-3 uppercase tracking-widest">
                          Refund initiated
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Amount</span>
                            <span className="text-xs font-mono text-emerald-400">
                              Rs. {result.refund.amount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Status</span>
                            <span className="text-xs font-mono text-emerald-400">
                              {result.refund.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <div className="flex flex-col items-center justify-center text-center p-10 min-h-64">
                    <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">
                      No result yet
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Submit a dispute to see the AI decision here.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Disputes table ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-1">
              // History
            </p>
            <h2 className="text-lg font-medium text-white tracking-tight">
              My Disputes
            </h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchMyDisputes}
          >
            Refresh
          </Button>
        </div>

        <Card animate={false}>
          {loadingList ? (
            <div className="p-10 text-center">
              <p className="text-xs font-mono text-slate-700">Loading...</p>
            </div>
          ) : myDisputes.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-xs font-mono text-slate-700">No disputes found.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Transaction", "Amount", "Decision", "Status", "Date"].map(h => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-mono text-slate-600 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myDisputes.map((d, i) => (
                  <motion.tr
                    key={d.dispute_id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`
                      border-b border-slate-800/50 hover:bg-slate-800/30
                      transition-colors duration-150 cursor-default
                      ${i === myDisputes.length - 1 ? "border-b-0" : ""}
                    `}
                  >
                    <td className="px-5 py-3 text-xs font-mono text-slate-300">
                      {d.transaction_id}
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-500">
                      {d.amount ? `Rs. ${d.amount}` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <ActionBadge action={d.ai_action} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-600">
                      {d.created_at?.slice(0, 10)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default CustomerPage