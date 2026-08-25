import { motion } from "framer-motion"

export function Button({
  children,
  onClick,
  variant   = "primary",
  size      = "md",
  disabled  = false,
  className = "",
  loading   = false,
  type      = "button",
}) {
  const variants = {
    primary:   "bg-slate-700 hover:bg-slate-600 text-white shadow-lg shadow-slate-950/30 border border-slate-600",
    secondary: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300",
    ghost:     "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent",
    danger:    "text-red-400 hover:bg-red-400/10 border border-red-500/20",
  }

  const sizes = {
    sm: "min-h-11 px-3   text-xs  rounded-md",
    md: "min-h-11 px-4   text-sm  rounded-lg",
    lg: "min-h-11 px-6   text-sm  rounded-lg",
    xl: "h-12 px-8   text-base rounded-xl",
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading && (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
      )}
      {children}
    </motion.button>
  )
}