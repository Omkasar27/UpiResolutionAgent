import { lazy, Suspense, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { NumberTicker } from "../components/ui/NumberTicker"
import { parallaxProducts } from "../data/parallaxProducts"
import { SiteNavbar } from "../components/SiteNavbar"

const HeroParallax = lazy(() => import("../components/ui/hero-parallax").then(module => ({ default: module.HeroParallax })))
const LampContainer = lazy(() => import("../components/ui/lamp").then(module => ({ default: module.LampContainer })))

const FEATURES = [
  {
    tag:   "AI AGENT",
    accent: "indigo",
    title: "Intelligent Decision Engine",
    desc:  "Every dispute is analyzed by an AI agent that cross-references bank records and merchant data to produce a deterministic resolution."
  },
  {
    tag:   "VERIFICATION",
    accent: "emerald",
    title: "Dual-Source Verification",
    desc:  "We query both the bank and merchant independently. Conflicting signals are automatically flagged for escalation."
  },
  {
    tag:   "AUDIT",
    accent: "amber",
    title: "Full Audit Trail",
    desc:  "Every action — dispute creation, AI decision, admin override — is logged with timestamp and actor."
  },
  {
    tag:   "ACCESS CONTROL",
    accent: "indigo",
    title: "Role-Based Access",
    desc:  "Customers see only their own disputes. Admins get a unified view with override controls enforced at the API layer."
  },
  {
    tag:   "RESOLUTION",
    accent: "emerald",
    title: "Automated Refund Flow",
    desc:  "When the AI determines a refund is warranted, the refund record is created instantly with no manual intervention."
  },
  {
    tag:   "DASHBOARD",
    accent: "amber",
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

const FEATURE_ACCENTS = {
  indigo: "bg-slate-300",
  emerald: "bg-emerald-400",
  amber: "bg-amber-300",
}

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true        },
  transition: { duration: 0.4, ease: "easeOut", delay }
})

function LandingPage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <div className="landing-canvas min-h-screen text-white">
      <div className="resolution-backdrop" aria-hidden="true" />

      {/* ── Navbar ── */}
      <SiteNavbar />

      {/* ── Hero ── */}
      <section className="relative px-6 pb-24 pt-32 lg:pt-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-px bg-slate-600/70" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.025)_100%)]" />
        </div>

        <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="h-px w-10 bg-amber-400" />
              <span className="text-xs text-amber-300 font-mono tracking-widest uppercase">
                Resolution infrastructure / 01
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="max-w-3xl text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02] mb-7"
            >
              Every dispute leaves a clear record.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="max-w-xl text-lg text-slate-400 leading-relaxed mb-10"
            >
              UPI disputes move through one accountable flow: bank evidence,
              merchant evidence, an AI decision, and a resolution your team can audit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="min-h-11 px-6 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-slate-950/30"
              >
                Raise a dispute
              </motion.button>
              <motion.a
                href="#how"
                whileHover={{ y: -2 }}
                className="min-h-11 px-6 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-150 flex items-center"
              >
                See the flow
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-lg border border-slate-700 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/60"
          >
            <div className="flex items-start justify-between border-b border-slate-700 pb-5">
              <div>
                <p className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase">Resolution record</p>
                <p className="mt-2 font-mono text-sm text-slate-200">#DSP-2048 / TXN001</p>
              </div>
              <span className="border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono text-emerald-300 uppercase tracking-widest">Verified</span>
            </div>
            <div className="space-y-4 py-6 font-mono text-xs">
              {[
                ["Bank signal", "Captured", "text-emerald-300"],
                ["Merchant signal", "Captured", "text-emerald-300"],
                ["Decision", "Refund candidate", "text-amber-300"],
                ["Confidence", "99.0%", "text-slate-100"],
              ].map(([label, value, valueClass]) => (
                <motion.div
                  key={label}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: shouldReduceMotion ? 0 : 0.42 + 0.08 * ["Bank signal", "Merchant signal", "Decision", "Confidence"].indexOf(label) }}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className={valueClass}>{value}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-700 pt-5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Next action</span>
              <span className="text-sm font-medium text-white">Refund initiated</span>
            </div>
            <div className="absolute -bottom-3 left-6 bg-amber-400 px-3 py-1 text-[10px] font-mono font-bold text-slate-950 uppercase tracking-widest">AI decision / sealed</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-24 grid grid-cols-2 gap-6 border-t border-slate-800 pt-8 md:grid-cols-4 md:gap-10"
        >
          {STATS.map((s, i) => (
            <div key={s.label}>
              <p className="text-2xl font-semibold text-white font-mono">
                {s.numeric != null ? <NumberTicker value={s.numeric} suffix={s.suffix} delay={400 + i * 70} /> : s.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Product showcase ── */}
      <section className="relative">
        <p className="text-center text-xs font-mono text-slate-600 tracking-widest uppercase pt-20">
          // Explore the platform
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-white tracking-tight mt-4">
          Everything a dispute needs, in one flow
        </h2>
        <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
          <HeroParallax products={parallaxProducts} />
        </Suspense>
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
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                whileFocus={shouldReduceMotion ? undefined : { y: -3 }}
                onClick={() => setActiveFeature(i)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setActiveFeature(i)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={activeFeature === i}
                className={`relative bg-slate-900 border rounded-xl p-6 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 ${activeFeature === i ? "border-slate-500 bg-slate-800/80" : "border-slate-800 hover:border-slate-600"}`}
              >
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleX: activeFeature === i ? 1 : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
                  className={`absolute inset-x-6 top-0 h-0.5 origin-left ${FEATURE_ACCENTS[f.accent]}`}
                />
                <p className="flex items-center gap-2 text-[10px] font-mono text-slate-400 tracking-widest mb-4 uppercase">
                  <span className={`h-1.5 w-1.5 rounded-full ${FEATURE_ACCENTS[f.accent]}`} aria-hidden="true" />
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

          <motion.div
            key={FEATURES[activeFeature].title}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
            className="mt-5 flex flex-col gap-3 border-l-2 border-slate-500 bg-slate-900/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            aria-live="polite"
          >
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Selected capability</p>
              <p className="mt-1 text-sm font-medium text-slate-100">{FEATURES[activeFeature].title}</p>
            </div>
            <p className="max-w-xl text-sm text-slate-400">{FEATURES[activeFeature].desc}</p>
          </motion.div>
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
                className="min-h-11 px-6 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-slate-950/30"
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
                  <span className="text-slate-200">user</span>
                  <span className="text-slate-500"> = </span>
                  <span className="text-slate-300">get_or_create_user</span>
                  <span className="text-slate-500">(</span>
                </p>
                <p className="pl-4 text-slate-400">
                  google_id, email, name
                </p>
                <p className="text-slate-500">)</p>
                <p className="mt-3">
                  <span className="text-slate-200">token</span>
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
        <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
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
            className="py-4 text-center text-4xl md:text-6xl font-semibold tracking-tight text-slate-100"
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
            className="min-h-11 px-8 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-slate-950/30"
          >
            Get started — it's free
          </motion.button>
          </LampContainer>
        </Suspense>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-slate-700 rounded-md flex items-center justify-center">
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