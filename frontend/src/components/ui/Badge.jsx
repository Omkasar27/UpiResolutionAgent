const statusStyles = {
  RESOLVED:  "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
  PENDING:   "text-amber-400   bg-amber-400/10   border-amber-500/20",
  ESCALATED: "text-red-400     bg-red-400/10     border-red-500/20",
  OPEN:      "text-slate-300   bg-slate-300/10   border-slate-500/20",
  default:   "text-slate-400   bg-slate-400/10   border-slate-500/20",
}

const actionStyles = {
  REFUND:   "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
  WAIT:     "text-amber-400   bg-amber-400/10   border-amber-500/20",
  ESCALATE: "text-red-400     bg-red-400/10     border-red-500/20",
  default:  "text-slate-500   bg-slate-500/10   border-slate-600/20",
}

export function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.default
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border ${style}`}>
      {status}
    </span>
  )
}

export function ActionBadge({ action }) {
  const style = actionStyles[action] || actionStyles.default
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border ${style}`}>
      {action || "—"}
    </span>
  )
}