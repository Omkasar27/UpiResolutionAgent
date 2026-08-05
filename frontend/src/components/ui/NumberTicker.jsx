import { useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

/**
 * Animates a number counting up from 0 to `value` when it scrolls
 * into view (or immediately, if already visible on mount).
 * Renders as inline text — drop it wherever a number goes.
 */
export function NumberTicker({
  value,
  decimals  = 0,
  prefix    = "",
  suffix    = "",
  className = "",
  delay     = 0,
}) {
  const ref        = useRef(null)
  const inView     = useInView(ref, { once: true, margin: "-10% 0px" })
  const motionVal  = useMotionValue(0)
  const spring     = useSpring(motionVal, { duration: 900, bounce: 0 })

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => motionVal.set(value), delay)
    return () => clearTimeout(t)
  }, [inView, value, delay, motionVal])

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (!ref.current) return
      ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
    })
  }, [spring, prefix, suffix, decimals])

  return (
    <motion.span ref={ref} className={className}>
      {prefix}0{suffix}
    </motion.span>
  )
}
