import { motion } from "framer-motion"

export function Card({
  children,
  className = "",
  hover     = false,
  animate   = true,
  padding   = false
}) {
  const base = `
    bg-slate-900 border border-slate-800 rounded-xl overflow-hidden
    ${padding ? "p-5" : ""}
    ${className}
  `

  if (!animate) {
    return <div className={base}>{children}</div>
  }

  return (
    <motion.div
      className={base}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={hover ? {
        y: -3,
        borderColor: "rgba(102,112,133,0.7)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
      } : {}}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-5 py-4 border-b border-slate-800 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = "" }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}