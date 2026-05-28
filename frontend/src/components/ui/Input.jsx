export function Input({ label, hint, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        className={`
          w-full h-9 px-3
          bg-slate-800/50 border border-slate-700 rounded-lg
          text-sm text-white placeholder-slate-600
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
          transition-all duration-150
          ${error ? "border-red-500/50" : ""}
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-slate-600 font-mono">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}

export function Textarea({ label, hint, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-3 py-2.5
          bg-slate-800/50 border border-slate-700 rounded-lg
          text-sm text-white placeholder-slate-600
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
          transition-all duration-150 resize-none
          ${error ? "border-red-500/50" : ""}
          ${className}
        `}
        {...props}
      />
      {hint && (
        <p className="text-xs text-slate-600 font-mono">{hint}</p>
      )}
    </div>
  )
}