import { useId } from "react"

export function Input({ label, hint, error, className = "", id, ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-mono text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="shine-border">
        <input
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={`
            w-full h-9 px-3
            bg-slate-800/50 border border-slate-700 rounded-lg
            text-sm text-white placeholder-slate-600
            focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30
            transition-all duration-150
            ${error ? "border-red-500/50" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-600 font-mono">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">{error}</p>
      )}
    </div>
  )
}

export function Textarea({ label, hint, error, className = "", id, ...props }) {
  const generatedId = useId()
  const textareaId = id || generatedId
  const hintId = hint ? `${textareaId}-hint` : undefined
  const errorId = error ? `${textareaId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-mono text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={`
          w-full px-3 py-2.5
          bg-slate-800/50 border border-slate-700 rounded-lg
          text-sm text-white placeholder-slate-600
          focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30
          transition-all duration-150 resize-none
          ${error ? "border-red-500/50" : ""}
          ${className}
        `}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-xs text-slate-600 font-mono">{hint}</p>
      )}
    </div>
  )
}