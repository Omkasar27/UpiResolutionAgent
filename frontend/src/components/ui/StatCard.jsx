import { motion } from "framer-motion"
import { NumberTicker } from "./NumberTicker"

export function StatCard({
  label,
  value,
  active  = false,
  onClick,
  index   = 0,
  trend   = null
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        text-left w-full p-4 rounded-xl border transition-all duration-200
        ${active
          ? "bg-slate-800 border-slate-500/50 shadow-lg shadow-slate-950/30"
          : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
        }
      `}
    >
      <div className="flex items-start justify-between mb-1">
        <p className={`text-2xl font-semibold font-mono ${
          active ? "text-white" : "text-white"
        }`}>
          <NumberTicker value={value} delay={150 + index * 50} />
        </p>
        {trend !== null && (
          <span className={`text-xs font-mono mt-1 ${
            trend > 0 ? "text-emerald-400" : "text-red-400"
          }`}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600 uppercase tracking-widest font-mono">
        {label}
      </p>
      {active && (
        <motion.div
          layoutId="stat-indicator"
          className="mt-3 h-px bg-slate-400/70 rounded-full"
        />
      )}
    </motion.button>
  )
}