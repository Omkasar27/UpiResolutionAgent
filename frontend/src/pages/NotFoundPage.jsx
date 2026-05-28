import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-sm"
      >
        {/* 404 */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-8xl font-bold text-slate-800 font-mono mb-6 select-none"
        >
          404
        </motion.p>

        {/* Label */}
        <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-4">
          // Not found
        </p>

        <h1 className="text-2xl font-semibold text-white tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="h-9 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Back to home
          </motion.button>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="h-9 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-sm font-medium rounded-lg transition-colors"
          >
            Go back
          </motion.button>
        </div>

        {/* Decorative grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-6 gap-1.5 opacity-20"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.random() > 0.5 ? 1 : 0.2 }}
              transition={{ delay: 0.3 + i * 0.02 }}
              className="w-full aspect-square bg-slate-800 rounded-sm"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage