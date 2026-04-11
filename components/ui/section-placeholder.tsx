"use client"

import { useEffect, useRef } from "react"

const CONFIGS = {
  projects: {
    colorA: "#05ddfa",
    colorB: "#8c31e8",
    label: "GTM Automations",
    icon: "⚡",
  },
  websites: {
    colorA: "#8c31e8",
    colorB: "#ec4899",
    label: "Websites Managed",
    icon: "🌐",
  },
  "ui-demos": {
    colorA: "#f59e0b",
    colorB: "#ef4444",
    label: "UI Demos",
    icon: "✦",
  },
}

export function SectionPlaceholder({ section }: { section: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cfg = CONFIGS[section as keyof typeof CONFIGS] ?? CONFIGS.projects

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    // Floating orbs
    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: 40 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: (i / 6) * Math.PI * 2,
    }))

    let t = 0
    let animId: number

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      // Dark base
      ctx.fillStyle = "#06060a"
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)"
      ctx.lineWidth = 0.5
      const step = 40
      for (let x = 0; x <= W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y <= H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy
        if (orb.x < -orb.r) orb.x = W + orb.r
        if (orb.x > W + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = H + orb.r
        if (orb.y > H + orb.r) orb.y = -orb.r

        const alpha = 0.12 + 0.06 * Math.sin(t * 0.02 + orb.phase)
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 2)
        grad.addColorStop(0, cfg.colorA + Math.round(alpha * 255).toString(16).padStart(2, "0"))
        grad.addColorStop(0.5, cfg.colorB + Math.round(alpha * 0.5 * 255).toString(16).padStart(2, "0"))
        grad.addColorStop(1, "transparent")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r * 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Scan line
      const scanY = ((t * 0.6) % (H + 20)) - 10
      const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2)
      scanGrad.addColorStop(0, "transparent")
      scanGrad.addColorStop(0.5, cfg.colorA + "22")
      scanGrad.addColorStop(1, "transparent")
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 2, W, 4)

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [cfg.colorA, cfg.colorB])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: "2.5rem" }}>{cfg.icon}</span>
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 600,
            background: `linear-gradient(90deg, ${cfg.colorA}, ${cfg.colorB})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {cfg.label}
        </span>
      </div>
    </div>
  )
}
