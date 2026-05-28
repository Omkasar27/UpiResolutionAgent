import { motion } from "framer-motion"

export function PageHeader({ tag, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b border-slate-800 pb-6 flex items-end justify-between"
    >
      <div>
        {tag && (
          <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-2">
            {tag}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}