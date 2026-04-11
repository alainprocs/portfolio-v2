"use client"

import { useRef, ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScrollExpansionHeroProps {
  title: string
  subtitle?: string
  placeholder: ReactNode
  children: ReactNode
}

export function ScrollExpansionHero({
  title,
  subtitle,
  placeholder,
  children,
}: ScrollExpansionHeroProps) {
  const outerRef = useRef<HTMLDivElement>(null)

  // Drive the entire animation off this section's scroll progress
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end start"],
  })

  // Media grows from a centered window to full width
  const mediaWidth  = useTransform(scrollYProgress, [0, 0.7], ["42%",  "100%"])
  const mediaHeight = useTransform(scrollYProgress, [0, 0.7], ["340px", "72vh"])
  const mediaRadius = useTransform(scrollYProgress, [0, 0.7], [20, 0])

  // Background darkens as media expands
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Title words split apart horizontally
  const word1X = useTransform(scrollYProgress, [0, 0.65], ["0%", "-42%"])
  const word2X = useTransform(scrollYProgress, [0, 0.65], ["0%",  "42%"])
  // Title fades out as it splits
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  // "scroll to expand" hint fades out quickly
  const hintOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])

  // Carousel fades in after expansion completes
  const carouselOpacity = useTransform(scrollYProgress, [0.72, 0.95], [0, 1])
  const carouselY       = useTransform(scrollYProgress, [0.72, 0.95], [40, 0])

  const words = title.split(" ")
  const half  = Math.ceil(words.length / 2)
  const lineA = words.slice(0, half).join(" ")
  const lineB = words.slice(half).join(" ")

  return (
    <>
      {/* ── Scroll zone: 250vh gives the sticky section room to animate ── */}
      <div ref={outerRef} style={{ minHeight: "250vh" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#06060a",
          }}
        >
          {/* ── Ambient glow background ──────────────────────────── */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: bgOpacity,
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,221,250,0.06) 0%, rgba(140,49,232,0.04) 40%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Title — above the media, splits apart on scroll ──── */}
          <motion.div
            style={{
              position: "absolute",
              top: "14%",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              pointerEvents: "none",
              zIndex: 10,
              opacity: titleOpacity,
            }}
          >
            <motion.span
              style={{
                x: word1X,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#fff",
                fontFamily: "var(--font-sora), sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {lineA}
            </motion.span>
            {lineB && (
              <motion.span
                style={{
                  x: word2X,
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  fontFamily: "var(--font-sora), sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {lineB}
              </motion.span>
            )}
          </motion.div>

          {/* ── Expanding media ──────────────────────────────────── */}
          <motion.div
            style={{
              width: mediaWidth,
              height: mediaHeight,
              borderRadius: mediaRadius,
              overflow: "hidden",
              position: "relative",
              marginTop: "6vh",   // push media below the title area
              boxShadow: "0 0 80px rgba(5,221,250,0.08), 0 0 160px rgba(140,49,232,0.06)",
            }}
          >
            {placeholder}
          </motion.div>

          {/* ── "Scroll to explore" hint ─────────────────────────── */}
          <motion.div
            style={{
              opacity: hintOpacity,
              position: "absolute",
              bottom: 36,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            {subtitle && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </span>
            )}
            {/* Bouncing chevron */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              style={{ color: "rgba(255,255,255,0.25)", fontSize: "1.2rem" }}
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Carousel lives AFTER the scroll zone ─────────────────── */}
      {/* It fades in as the user approaches the end of the 250vh zone */}
      <motion.div
        style={{
          opacity: carouselOpacity,
          y: carouselY,
          background: "#06060a",
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
