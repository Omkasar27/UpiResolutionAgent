// ── Color tokens ──────────────────────────────────────────
export const colors = {
  background: "bg-slate-950",
  surface: "bg-slate-900",
  surfaceElevated: "bg-slate-800",
  foreground: "text-white",
  foregroundSecondary: "text-slate-200",
  foregroundTertiary: "text-slate-300",
  foregroundMuted: "text-slate-400",
  border: "border-slate-800",
  borderStrong: "border-slate-700",
  primary: "bg-slate-700",
  primaryHover: "bg-slate-600",
  success: "text-emerald-400",
  warning: "text-amber-400",
  destructive: "text-red-400",
  info: "text-slate-300",
}

// ── Status badge tokens ───────────────────────────────────
export const statusStyles = {
  RESOLVED:  "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
  PENDING:   "text-amber-400   bg-amber-400/10   border-amber-500/20",
  ESCALATED: "text-red-400     bg-red-400/10     border-red-500/20",
  OPEN:      "text-slate-300   bg-slate-300/10   border-slate-500/20",
  default:   "text-slate-400   bg-slate-400/10   border-slate-500/20",
}

export const actionStyles = {
  REFUND:   "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
  WAIT:     "text-amber-400   bg-amber-400/10   border-amber-500/20",
  ESCALATE: "text-red-400     bg-red-400/10     border-red-500/20",
  default:  "text-slate-500   bg-slate-500/10   border-slate-600/20",
}

// ── Typography tokens ─────────────────────────────────────
export const typography = {
  pageTitle:    "text-2xl font-semibold text-white tracking-tight",
  sectionTitle: "text-lg font-medium text-white tracking-tight",
  cardTitle:    "text-sm font-medium text-white",
  label:        "text-xs font-mono text-slate-500 uppercase tracking-widest",
  body:         "text-sm text-slate-400 leading-relaxed",
  mono:         "font-mono text-xs text-slate-400",
  caption:      "text-xs text-slate-600",
}

// ── Card styles ───────────────────────────────────────────
export const card = {
  base:    "bg-slate-900 border border-slate-800 rounded-xl",
  hover:   "hover:border-slate-700 transition-colors duration-200",
  padding: "p-5",
}

// ── Input styles ──────────────────────────────────────────
export const input = {
  base: "w-full bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-all duration-150",
}

// ── Button styles ─────────────────────────────────────────
export const button = {
  primary:   "bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-150 active:scale-[0.98]",
  secondary: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium rounded-lg transition-all duration-150",
  ghost:     "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all duration-150",
  danger:    "text-red-400 hover:bg-red-400/10 border border-red-500/20 rounded-lg transition-all duration-150",
}