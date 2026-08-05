import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { NumberTicker } from "../components/ui/NumberTicker"
import { LampContainer } from "../components/ui/lamp"
import { HeroParallax } from "../components/ui/hero-parallax"
import { parallaxProducts } from "../data/parallaxProducts"
import { SiteNavbar } from "../components/SiteNavbar"

const FEATURES = [
  {
    tag:   "AI AGENT",
    title: "Intelligent Decision Engine",
    desc:  "Every dispute is analyzed by an AI agent that cross-references bank records and merchant data to produce a deterministic resolution."
  },
  {
    tag:   "VERIFICATION",
    title: "Dual-Source Verification",
    desc:  "We query both the bank and merchant independently. Conflicting signals are automatically flagged for escalation."
  },
  {
    tag:   "AUDIT",
    title: "Full Audit Trail",
    desc:  "Every action — dispute creation, AI decision, admin override — is logged with timestamp and actor."
  },
  {
    tag:   "ACCESS CONTROL",
    title: "Role-Based Access",
    desc:  "Customers see only their own disputes. Admins get a unified view with override controls enforced at the API layer."
  },
  {
    tag:   "RESOLUTION",
    title: "Automated Refund Flow",
    desc:  "When the AI determines a refund is warranted, the refund record is created instantly with no manual intervention."
  },
  {
    tag:   "DASHBOARD",
    title: "Admin Operations Center",
    desc:  "A structured table view of all disputes with search, filter by status, and per-row override controls."
  }
]

const HOW_IT_WORKS = [
  {
    index: "01",
    title: "Customer raises dispute",
    desc:  "The customer submits a transaction ID. The platform immediately fetches live data from the bank and merchant systems."
  },
  {
    index: "02",
    title: "AI agent analyzes",
    desc:  "The AI agent receives bank status, merchant status, and amount. It returns a structured decision with a confidence score."
  },
  {
    index: "03",
    title: "Resolution is executed",
    desc:  "Based on the AI decision, the system initiates a refund, marks the case pending, or escalates to a human reviewer."
  }
]

const STATS = [
  { value: "< 5s",  label: "Resolution time" },
  { value: "99%",   label: "Uptime SLA",     numeric: 99, suffix: "%" },
  { value: "3-way", label: "Verification"    },
  { value: "JWT",   label: "Auth standard"   },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true        },
  transition: { duration: 0.4, ease: "easeOut", delay }
})

const fadeIn = (delay = 0) => ({
  initial:    { opacity: 0 },
  whileInView:{ opacity: 1 },
  viewport:   { once: true },
  transition: { duration: 0.4, ease: "easeOut", delay }
})

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Navbar ── */}
      <SiteNavbar />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">

        {/* Ambient glow — a resolution seal warming up behind the headline */}
        <div className="absolute inset-0 -z-10 pointer-events-none motion-reduce:hidden" aria-hidden="true">
          <motion.div
            className="absolute left-1/2 top-0 w-[640px] h-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-600/[0.14] blur-[130px]"
            animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.06, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[15%] top-32 w-[360px] h-[360px] rounded-full bg-emerald-500/[0.06] blur-[110px]"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">
              AI-Powered Resolution Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            UPI dispute resolution,
            <br />
            <span className="text-slate-500">decided by AI.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed max-w-xl mb-10"
          >
            A structured mediation layer between customers, merchants, and banks.
            Every dispute is verified, analyzed, and resolved — automatically.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex items-center gap-4"
          >
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Raise a dispute
            </motion.button>
            <motion.a
              href="#how"
              whileHover={{ y: -2 }}
              className="h-10 px-6 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-sm font-medium rounded-lg transition-all duration-150 flex items-center"
            >
              How it works
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-10 mt-20 pt-10 border-t border-slate-800"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
              >
                <p className="text-2xl font-semibold text-white font-mono">
                  {s.numeric != null
                    ? <NumberTicker value={s.numeric} suffix={s.suffix} delay={400 + i * 70} />
                    : s.value
                  }
                </p>
                <p className="text-xs text-slate-600 mt-1 uppercase tracking-widest font-mono">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Product showcase ── */}
      <section className="relative">
        <p className="text-center text-xs font-mono text-slate-600 tracking-widest uppercase pt-20">
          // Explore the platform
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-white tracking-tight mt-4">
          Everything a dispute needs, in one flow
        </h2>
        <HeroParallax products={parallaxProducts} />
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-slate-800" />
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div {...fadeUp(0)} className="mb-16">
            <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-4">
              // Features
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Built for reliability, not demos.
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg text-base leading-relaxed">
              Every component is designed to handle real disputes
              with auditability and precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -3, borderColor: "rgba(99,102,241,0.25)" }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-default transition-colors duration-200"
              >
                <p className="text-[10px] font-mono text-slate-600 tracking-widest mb-4 uppercase">
                  {f.tag}
                </p>
                <h3 className="text-sm font-semibold text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-slate-800" />
      </div>

      {/* ── How it works ── */}
      <section id="how" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div {...fadeUp(0)} className="mb-16">
            <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-4">
              // How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Three steps. Fully automated.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.index}
                {...fadeUp(i * 0.1)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-8"
              >
                <p className="text-5xl font-bold text-slate-800 font-mono mb-6 select-none">
                  {s.index}
                </p>
                <h3 className="text-sm font-semibold text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-slate-800" />
      </div>

      {/* ── Security ── */}
      <section id="security" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <motion.div {...fadeUp(0)}>
              <p className="text-xs font-mono text-slate-600 tracking-widest uppercase mb-4">
                // Security
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
                Secure by design.
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Authentication via Google OAuth. All API routes protected with JWT.
                Role-based access ensures customers only see their own disputes
                while admins get full visibility.
              </p>
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Get started
              </motion.button>
            </motion.div>

            {/* Code card */}
            <motion.div
              {...fadeUp(0.1)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-slate-600 text-xs ml-2">auth_flow.py</span>
              </div>
              <div className="space-y-1 text-xs leading-relaxed">
                <p className="text-slate-600"># Google OAuth callback</p>
                <p>
                  <span className="text-indigo-400">user</span>
                  <span className="text-slate-500"> = </span>
                  <span className="text-slate-300">get_or_create_user</span>
                  <span className="text-slate-500">(</span>
                </p>
                <p className="pl-4 text-slate-400">
                  google_id, email, name
                </p>
                <p className="text-slate-500">)</p>
                <p className="mt-3">
                  <span className="text-indigo-400">token</span>
                  <span className="text-slate-500"> = </span>
                  <span className="text-slate-300">create_access_token</span>
                  <span className="text-slate-500">(</span>
                </p>
                <p className="pl-4 text-slate-400">
                  identity<span className="text-slate-500">=</span>str<span className="text-slate-500">(</span>user<span className="text-slate-500">[</span><span className="text-emerald-400">"id"</span><span className="text-slate-500">]),</span>
                </p>
                <p className="pl-4 text-slate-400">
                  role<span className="text-slate-500">=</span>user<span className="text-slate-500">[</span><span className="text-emerald-400">"role"</span><span className="text-slate-500">]</span>
                </p>
                <p className="text-slate-500">)</p>
                <p className="mt-3 text-slate-600"># role: customer | admin</p>
                <p className="text-slate-600"># JWT enforced on all routes</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <LampContainer>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeInOut" }}
            className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-6"
          >
            // Get started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="bg-gradient-to-br from-slate-100 to-slate-500 py-4 bg-clip-text text-center text-4xl md:text-6xl font-semibold tracking-tight text-transparent"
          >
            Ready to resolve disputes
            <br />at scale?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
            className="text-slate-500 text-base mt-6 mb-10 max-w-md mx-auto leading-relaxed text-center"
          >
            Sign in with Google and raise your first dispute in under 60 seconds.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
            onClick={() => navigate("/login")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="h-10 px-8 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Get started — it's free
          </motion.button>
        </LampContainer>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">U</span>
            </div>
            <span className="text-xs text-slate-600">UPI Dispute Platform</span>
          </div>
          <p className="text-xs text-slate-700 font-mono">2026</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage